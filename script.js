let currentQuestion = 1;
let questions = [];

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
    btn.onclick = () => checkAnswer(btn, key, q.answer, q.explanation, q.textbook, q.chapter, q.page);
    optionsContainer.appendChild(btn);
  }

  // Reset state for feedback and explanation
  document.getElementById('feedback').innerText = '';
  document.getElementById('explanation').style.display = 'none';
  document.getElementById('explanation').innerHTML = '';
  
  // ✅ Reset explanation toggle button state and label
  const toggleBtn = document.getElementById('toggle-explanation');
  toggleBtn.style.display = 'none';
  toggleBtn.innerText = 'Show Explanation';
}

function checkAnswer(button, selected, correct, explanation, textbook, chapter, page) {
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

  button.classList.add('selected');
  document.getElementById('feedback').innerText = `Correct answer: ${correct}`;

  const explanationBox = document.getElementById('explanation');
  explanationBox.innerHTML = `
    <strong>Explanation:</strong><br>${explanation}<br><br>
    <em>Reference: ${textbook}, ${chapter}, page ${page}</em>
  `;
  explanationBox.style.display = 'none';

  const toggleBtn = document.getElementById('toggle-explanation');
  toggleBtn.style.display = 'inline-block';
  toggleBtn.innerText = 'Show Explanation'; // ✅ Reset label
}

function toggleExplanation() {
  const exp = document.getElementById('explanation');
  const toggleBtn = document.getElementById('toggle-explanation');

  if (exp.style.display === 'none') {
    exp.style.display = 'block';
    toggleBtn.innerText = 'Hide Explanation';
  } else {
    exp.style.display = 'none';
    toggleBtn.innerText = 'Show Explanation';
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
