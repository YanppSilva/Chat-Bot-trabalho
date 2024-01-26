const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');

let userMessage;
const API_KEY = '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'; //
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  // Cria um elemento de chat <li> com a menssagem passada e a classe.
  const chatLi = document.createElement('li');
  chatLi.classList.add('chat', className);
  let chatContent =
    className === 'outgoing'
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector('p').textContent = message;
  return chatLi;
};

const readtext = document.querySelector('.incoming p');
//cria efeito de "maquina de escrever" na resposta do chat
function typeWriter(element) {
  const textArray = element.innerHTML.split('');
  element.innerHTML = '';
  textArray.forEach((letter, i) => {
    setTimeout(()=> 
      element.innerHTML += letter, 45 * i);
  });
}
typeWriter(readtext);

const generateResponse = async (incomingChatLi) => {
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const messageElement = incomingChatLi.querySelector('p');

  const requestOptions = {
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": userMessage
        }
      ]
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    }
  };

  await fetch(
    API_URL,
    requestOptions,
  ).then(res => res.json()).then(data => {
    messageElement.textContent = data.choices[0].message.content;
  }).catch((error) => {
    messageElement.classList.add('error');
    messageElement.textContent = 'Oops! Algo deu errado. Tente novamente';
  }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
  typeWriter(messageElement);
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = '';
  chatInput.style.height = `${inputInitHeight}px`;

  // Anexa a mensagem do usuário à caixa de bate-papo
  chatbox.appendChild(createChatLi(userMessage, 'outgoing'));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Mostra a mensagem "Processando..." enquanto espera pela resposta do bot.
    const incomingChatLi = createChatLi('Processando...', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};
chatInput.addEventListener('input', () => {
  // Ajusta a altura do input baseado no conteúdo.
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener('keydown', (e) => {
  // Se a tecla ENTER for pressionada sem o SHIFT e a tela for maior que 800px, ativa o chat.
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});
sendChatBtn.addEventListener('click', handleChat);

function toggleMenu(){
  const menuMobile = document.getElementById('menu-mobile');

  if(menuMobile.className === 'menu-mobile-active'){
    menuMobile.className = 'menu-mobile'
  } else {
    menuMobile.className = 'menu-mobile-active'
  }
}







