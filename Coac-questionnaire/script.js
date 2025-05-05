const questions = [
    {
      type: "intro",
      message: (name) => `Okay ${name}, vamos a probar si puedes resolver las preguntas`,
      image: "img123.jpeg",
      buttonText: "Siguiente"
    },
    {
      type: "gay-question",
      question: "Eres g4y?",
      image: "img321.jpg",
      answers: [
        { text: "Sí", correct: true, action: "continue" },
        { text: "No", correct: false, action: "escape" }
      ]
    },
    {
      type: "gay-response",
      message: "JHAHSDJHASJHD, lo sabia. Ahora si comencemos con el quizz",
      image: "img987.jpg",
      buttonText: "Comenzar Quiz"
    },
    {
      question: "¿Cuál de las siguientes oraciones corresponde a la definición de oración simple?",
      points: 2,
      image: "img1.jpg",
      answers: [
        { text: "▲ María estudia y Pedro cocina.", correct: false },
        { text: "● Juan corre.", correct: true },
        { text: "◆ Los estudiantes que aprobaron el curso celebraron.", correct: false },
        { text: "■ Porque no vino, se canceló la reunión.", correct: false },
      ],
    },
    {
      question: "¿Cuál de las siguientes oraciones tiene concordancia correcta entre sujeto y predicado?",
      points: 2,
      image: "img2.jpg",
      answers: [
        { text: "▲ El niño juegan en el parque.", correct: false },
        { text: "◆ Las chicas estudia para el examen.", correct: false },
        { text: "● El profesor explica la lección.", correct: true },
        { text: "■ Yo tenemos hambre.", correct: false },
      ],
    },
    {
      question: "¿Qué es el componente sintáctico?",
      points: 2,
      image: "img3.jpg",
      answers: [
        { text: "● Componente encargado de organizar palabras en estructuras con sentido.", correct: true },
        { text: "▲ Parte del lenguaje que estudia los sonidos.", correct: false },
        { text: "◆ Estudio del significado de las palabras.", correct: false },
        { text: "■ Parte del lenguaje que se enfoca en los fonemas.", correct: false },
      ],
    },
    {
      question: "Clasifica la siguiente oración según su estructura: Los estudiantes escuchan y toman apuntes durante la clase.",
      points: 2,
      image: "img4.jpg",
      answers: [
        { text: "● Oración compuesta por subordinación", correct: false },
        { text: "▲ Oración compuesta por coordinación", correct: true },
        { text: "◆ Oración simple", correct: false },
        { text: "■ Enunciado unimembre", correct: false },
      ],
    },
    {
        question: "¿Qué tipo de sintagma es?: El perro negro",
        points: 2,
        image: "img5.jpeg",
        answers: [
          { text: "● Sintagma verbal", correct: false },
          { text: "◆ Sintagma preposicional", correct: false },
          { text: "■ Sintagma bombardino cocodrilo", correct: false },
          { text: "▲ Sintagma nominal", correct: true }
        ],
      },
      {
        question: "¿Qué tipo de sintagma es? : corre rápidamente",
        points: 2,
        image: "img6.jpeg",
        answers: [
          { text: "● Sintagma verbal", correct: true },
          { text: "◆ Sintagma preposicional", correct: false },
          { text: "■ Esta es la respuesta", correct: false },
          { text: "▲ Sintagma nominal", correct: false }
        ],
      },
      {
        question: "¿Qué tipo de sintagma es? : con mucha energía",
        points: 2,
        image: "img7.jpeg",
        answers: [
          { text: "● Sintagma verbal", correct: false },
          { text: "◆ Sintagma preposicional", correct: true },
          { text: "■ Creo que deberia de ser una respuesta", correct: false },
          { text: "▲ Sintagma nominal", correct: false }
        ],
      },
      {
        type: "connect",
        question: "Conecta cada sintagma con su función habitual dentro de una oración",
        pointsPerConnection: 2,
        connections: [
          { left: "Sintagma nominal", right: "Sujeto o complemento directo" },
          { left: "Sintagma verbal", right: "Predicado" },
          { left: "Sintagma preposicional", right: "Complemento circunstancial o régimen" },
          { left: "Sintagma adjetival", right: "Modificador del sustantivo" }
        ],
        shuffleOptions: true
      }
  ];
  
  // Elementos del DOM
  const questionText = document.getElementById("question-text");
  const answerButtons = document.getElementById("answer-buttons");
  const nextButton = document.getElementById("next-btn");
  const coverContainer = document.getElementById("cover-container");
  const questionContainer = document.getElementById("question-container");
  const nameContainer = document.getElementById("name-container");
  const userNameInput = document.getElementById("user-name");
  const submitNameBtn = document.getElementById("submit-name");
  const startButton = document.getElementById("start-btn");
  const questionImage = document.getElementById("question-image");
  
  // Variables de estado
  let currentQuestionIndex = 0;
  let userName = "";
  
  // Event Listeners
  startButton.addEventListener("click", () => {
    coverContainer.style.display = "none";
    nameContainer.style.display = "block";
  });
  
  submitNameBtn.addEventListener("click", () => {
    if (userNameInput.value.trim() === "") {
      alert("Por favor ingresa tu nombre");
      return;
    }
    userName = userNameInput.value.trim();
    nameContainer.style.display = "none";
    startQuiz();
  });
  

  
  // Funciones principales
  function startQuiz() {
    questionContainer.style.display = "block";
  currentQuestionIndex = 0;
  nextButton.innerText = "Siguiente";
  nextButton.style.display = "block"; 
  showQuestion();
  }
  
  function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion.type === "intro") {
        showIntroScreen(currentQuestion);
      } else if (currentQuestion.type === "gay-question") {
        showGayQuestion(currentQuestion);
      } else if (currentQuestion.type === "gay-response") {
        showGayResponse(currentQuestion);
      } else if (currentQuestion.type === "connect") {
        showConnectQuestion(currentQuestion);
      } else {
      // Mostrar selección previa si existe
    if (currentQuestion.userAnswer) {
        const selectedBtn = [...answerButtons.querySelectorAll('.btn')].find(
        btn => btn.textContent === currentQuestion.userAnswer.text
        );
        if (selectedBtn) {
        selectedBtn.classList.add("confirmed");
        }
    } else if (currentQuestion.tempAnswer) {
        const selectedBtn = [...answerButtons.querySelectorAll('.btn')].find(
        btn => btn.textContent === currentQuestion.tempAnswer.text
        );
        if (selectedBtn) {
        selectedBtn.classList.add("selected");
        }
    }
    
      questionText.innerText = `${userName}, ${currentQuestion.question}`;
      questionImage.src = currentQuestion.image || "";
      questionImage.style.display = currentQuestion.image ? "block" : "none";
      
      currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        const colorClasses = ["btn-red", "btn-blue", "btn-yellow", "btn-green"];
        button.classList.add(colorClasses[index]);
        if (answer.correct) button.dataset.correct = "true";
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
      });
    }
  }
  
  function resetState() {
    answerButtons.innerHTML = "";
    
    // Mostrar "Siguiente" excepto en preguntas especiales
    if (!['gay-question'].includes(questions[currentQuestionIndex]?.type)) {
      nextButton.style.display = "block";
      nextButton.innerText = currentQuestionIndex === questions.length - 1 ? "Ver resultados" : "Siguiente";
    } else {
      nextButton.style.display = "none";
    }
  }
  
  function selectAnswer(e) {
    const selectedBtn = e.target;
    
    // Remover selección previa
    document.querySelectorAll('.btn.selected').forEach(btn => {
      btn.classList.remove("selected");
    });
    
    // Marcar nueva selección
    selectedBtn.classList.add("selected");
    
    // Guardar respuesta temporal
    questions[currentQuestionIndex].tempAnswer = {
      text: selectedBtn.textContent,
      correct: selectedBtn.dataset.correct === "true",
      element: selectedBtn
    };
  }
  function showIntroScreen(question) {
    questionText.innerHTML = `<h2>${question.message(userName)}</h2>`;
    questionImage.src = question.image;
    questionImage.style.display = "block";
    
    nextButton.innerText = question.buttonText;
    nextButton.style.display = "block";
    nextButton.onclick = () => {
      currentQuestionIndex++;
      showQuestion();
    };
  }
  
  function showGayQuestion(question) {
    resetState();
    questionText.innerText = question.question;
    questionImage.src = question.image;
    questionImage.style.display = "block";
    
    const container = document.createElement("div");
    container.className = "gay-container";
    
    question.answers.forEach(answer => {
      const button = document.createElement("button");
      button.innerText = answer.text;
      button.classList.add("btn", answer.action === "continue" ? "btn-green" : "btn-red");
      
      if (answer.action === "continue") {
        button.addEventListener("click", () => {
          questions[currentQuestionIndex].userAnswer = {
            text: answer.text,
            correct: answer.correct,
            points: answer.correct ? 2 : 0
          };
          currentQuestionIndex++;
          showQuestion();
        });
      } else {
        button.addEventListener("mouseover", moveButton);
        button.addEventListener("touchstart", moveButton); // Para móviles
      }
      
      container.appendChild(button);
    });
    
    answerButtons.appendChild(container);
    nextButton.style.display = "none"; // Ocultar siguiente en esta pantalla
  }
  function moveButton(e) {
    e.preventDefault(); // Prevenir comportamiento por defecto
    const button = e.target;
    const container = answerButtons.getBoundingClientRect();
    
    // Coordenadas aleatorias que mantengan el botón visible
    const maxX = container.width - button.offsetWidth - 20;
    const maxY = container.height - button.offsetHeight - 20;
    
    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));
    
    button.style.position = "absolute";
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
    button.style.transition = "left 0.3s ease, top 0.3s ease";
    
    // Pequeña animación para hacerlo más divertido
    button.style.transform = "scale(1.1)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 300);
  }
  function showGayResponse(question) {
    questionText.innerHTML = `<h2>${question.message}</h2>`;
    questionImage.src = question.image;
    questionImage.style.display = "block";
    
    nextButton.innerText = question.buttonText;
    nextButton.style.display = "block";
    nextButton.onclick = () => {
      currentQuestionIndex++;
      showQuestion(); 
    };
  }
  function showConnectQuestion(question) {
    resetState();
    questionText.innerText = question.question;
    questionImage.style.display = "none"; // Ocultar imagen si no es necesaria
  
    const connectContainer = document.createElement("div");
    connectContainer.className = "connect-container";
  
    // Preparar opciones (mezcladas si es necesario)
    const rightOptions = question.connections.map(c => c.right);
    if (question.shuffleOptions) {
      rightOptions.sort(() => Math.random() - 0.5);
    }
  
    // Crear tabla de conexiones
    question.connections.forEach((connection, index) => {
      const connectionRow = document.createElement("div");
      connectionRow.className = "connection-row";
  
      // Elemento izquierdo (fijo)
      const leftElement = document.createElement("div");
      leftElement.className = "connection-left";
      leftElement.textContent = connection.left;
      connectionRow.appendChild(leftElement);
  
      // Dropdown para seleccionar conexión
      const select = document.createElement("select");
      select.className = "connection-select";
      select.dataset.leftIndex = index;
  
      // Opción por defecto
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "-- Selecciona --";
      select.appendChild(defaultOption);
  
      // Opciones disponibles
      rightOptions.forEach((option, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = option;
        select.appendChild(opt);
      });
  
      connectionRow.appendChild(select);
      connectContainer.appendChild(connectionRow);
    });
  
    answerButtons.appendChild(connectContainer);
    nextButton.style.display = "block";
  }
  

  function checkConnections() {
    const selects = document.querySelectorAll('.connection-select');
    return [...selects].every(select => select.value !== "");
  }
  function handleNextButton() {
    // Guardar respuesta solo si no es pregunta especial
    if (!['intro', 'gay-question', 'gay-response'].includes(questions[currentQuestionIndex].type)) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion.tempAnswer) {
        currentQuestion.userAnswer = {
          text: currentQuestion.tempAnswer.text,
          correct: currentQuestion.tempAnswer.correct,
          points: currentQuestion.tempAnswer.correct ? currentQuestion.points || 2 : 0
        };
      }
    }
  
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  }
  function checkAllSelected() {
    const selects = document.querySelectorAll('.connection-select');
    return [...selects].every(select => select.value !== "");
  }
  function calculateScore() {
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    questions.forEach(question => {
      if (question.type === "connect") {
        // Pregunta de conexión (2 puntos por cada conexión correcta)
        maxPossibleScore += question.pointsPerConnection * question.connections.length;
        
        if (question.userConnections) {
          question.userConnections.forEach(conn => {
            if (conn.isCorrect) {
              totalScore += question.pointsPerConnection;
            }
          });
        }
      } else {
        // Pregunta normal (2 puntos)
        maxPossibleScore += 2;
        
        if (question.userAnswer && question.userAnswer.correct) {
          totalScore += 2;
        }
      }
    });
    
    return {
      totalScore,
      maxPossibleScore,
      percentage: Math.round((totalScore / maxPossibleScore) * 100)
    };
  }
  function saveConnectionAnswers() {
    const currentQuestion = questions[currentQuestionIndex];
    const selects = document.querySelectorAll('.connection-select');
    
    currentQuestion.userConnections = [];
    
    selects.forEach(select => {
      const leftIndex = parseInt(select.dataset.leftIndex);
      const selectedOption = select.options[select.selectedIndex];
      
      currentQuestion.userConnections.push({
        left: currentQuestion.connections[leftIndex].left,
        selectedRight: selectedOption.text,
        isCorrect: selectedOption.text === currentQuestion.connections[leftIndex].right,
        points: selectedOption.text === currentQuestion.connections[leftIndex].right ? 2 : 0
      });
    });
  }
  function showScore() {
    const score = calculateScore();
    resetState();
    
    questionText.innerHTML = `
      <h2>¡Felicidades ${userName}!</h2>
      <p>Has completado el cuestionario</p>
      <div class="score-container">
        <div class="score-display">
          <span class="score">${score.totalScore}</span>
          <span class="score-separator">/</span>
          <span class="max-score">${score.maxPossibleScore}</span>
        </div>
        <div class="score-percentage">${score.percentage}%</div>
      </div>
    `;
    
    questionText.classList.add("finished");
    nextButton.innerText = "Volver al inicio";
    nextButton.style.display = "block";
    
    // Eliminar listener antiguo y crear uno nuevo
    const newNextBtn = nextButton.cloneNode(true);
    nextButton.parentNode.replaceChild(newNextBtn, nextButton);
    newNextBtn.addEventListener("click", resetQuiz);
  }
  
  function resetQuiz() {
    questionContainer.style.display = "none";
    coverContainer.style.display = "block";
    questionText.classList.remove("finished");
    currentQuestionIndex = 0;
    userNameInput.value = "";
    userName = "";
  }