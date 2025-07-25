let currentQuestion = 1;
let questions = [];
let userAnswers = {}; // Stores user's selected answer and explanation state

fetch('set2_full_100.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    displayQuestion(currentQuestion);
  });

function displayQuestion(num) {
  const q = questions[num - 1];
  if (!q) return;

  document.getElementById('question-number').innerText = `Question ${q.questionNumber}`;
  document.getElementById('question-text').innerText = q.question;

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  for (let key in q.options) {
    const btn = document.createElement('button');
    btn.innerText = `${key}. ${q.options[key]}`;
    btn.className = 'option';
    btn.onclick = () => {
      checkAnswer(btn, key, q.answer, q.explanation, q.textbook, q.chapter, q.page);
      userAnswers[num] = {
        selected: key,
        showExplanation: true
      };
    };
    optionsContainer.appendChild(btn);
  }

  // Clear previous state
  document.getElementById('feedback').innerText = '';
  document.getElementById('explanation').innerHTML = '';
  document.getElementById('explanation').style.display = 'none';
  document.getElementById('toggle-explanation').style.display = 'none';

  // Restore user state if exists
  if (userAnswers[num]) {
    const selected = userAnswers[num].selected;
    const showExplanation = userAnswers[num].showExplanation;
    checkAnswer(
      [...optionsContainer.children].find(b => b.innerText.startsWith(selected)),
      selected,
      q.answer,
      q.explanation,
      q.textbook,
      q.chapter,
      q.page,
      true
    );

    if (showExplanation) {
      document.getElementById('explanation').style.display = 'block';
      document.getElementById('toggle-explanation').innerText = 'Hide Explanation';
    } else {
      document.getElementById('explanation').style.display = 'none';
      document.getElementById('toggle-explanation').innerText = 'Show Explanation';
    }
  }
}

function checkAnswer(button, selected, correct, explanation, textbook, chapter, page, isRestore = false) {
  const buttons = document.querySelectorAll('#options-container button');
  buttons.forEach(btn => {
    btn.classList.add('disabled');
    btn.disabled = true;
    if (btn.innerText.startsWith(correct)) {
      btn.classList.add('correct');
    }
    if (btn.innerText.startsWith(selected) && selected !== correct) {
      btn.classList.add('incorrect');
    }
  });

  if (!isRestore) button.classList.add('selected');

  document.getElementById('feedback').innerText = `Correct answer: ${correct}`;
  document.getElementById('toggle-explanation').style.display = 'inline-block';
  document.getElementById('explanation').innerHTML = `
    <strong>Explanation:</strong><br>${explanation}<br><br>
    <em>Reference: ${textbook}, ${chapter}, page ${page}</em>
  `;
}

function toggleExplanation() {
  const exp = document.getElementById('explanation');
  const isVisible = exp.style.display !== 'none';
  exp.style.display = isVisible ? 'none' : 'block';
  document.getElementById('toggle-explanation').innerText = isVisible ? 'Show Explanation' : 'Hide Explanation';

  // Save explanation toggle state
  if (userAnswers[currentQuestion]) {
    userAnswers[currentQuestion].showExplanation = !isVisible;
  }
}

function nextQuestion() {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    displayQuestion(currentQuestion);
  }
}

function prevQuestion() {
  if (currentQuestion > 1) {
    currentQuestion--;
    displayQuestion(currentQuestion);
  }
}

function goToQuestion() {
  const num = parseInt(document.getElementById('jump-input').value);
  if (num >= 1 && num <= questions.length) {
    currentQuestion = num;
    displayQuestion(currentQuestion);
  } else {
    alert(`Please enter a valid question number (1–${questions.length})`);
  }
}
