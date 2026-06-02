// Chave usada para salvar e carregar os dados da lista no navegador.
const STORAGE_KEY = "listaCompras";

// Elementos do formulário e da lista no DOM.
const form = document.getElementById("shopping-form");
const inputName = document.getElementById("item-name");
const inputQuantity = document.getElementById("item-quantity");
const listElement = document.getElementById("shopping-list");
const emptyState = document.getElementById("empty-state");
const clearButton = document.getElementById("clear-btn");

// Array que mantém a lista de itens em memória.
let items = []; 

// Carrega a lista salva no localStorage quando a página é aberta.
function carregarItens() {
  const dados = localStorage.getItem(STORAGE_KEY);
  if (!dados) {
    items = [];
    return;
  }

  try {
    items = JSON.parse(dados);
  } catch (error) {
    // Se os dados estiverem inválidos, reinicia a lista.
    items = [];
  }
}

// Salva o estado atual da lista no localStorage.
function salvarItens() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Atualiza o HTML da lista sempre que os itens mudam.
function atualizarLista() {
  listElement.innerHTML = "";

  if (items.length === 0) {
    emptyState.style.display = "block";
    clearButton.disabled = true;
    return;
  }

  emptyState.style.display = "none";
  clearButton.disabled = false;

  items.forEach((item) => {
    // Cria cada item da lista dinamicamente a partir do array.
    const listItem = document.createElement("li");
    listItem.className = `shopping-item${item.comprado ? " completed" : ""}`;

    const details = document.createElement("div");
    details.className = "item-details";

    const title = document.createElement("p");
    title.className = "item-name";
    title.textContent = item.nome;

    const quantity = document.createElement("p");
    quantity.className = "item-quantity";
    quantity.textContent = `Quantidade: ${item.quantidade}`;

    details.append(title, quantity);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "btn btn-secondary";
    toggleButton.textContent = item.comprado ? "Desmarcar" : "Marcar como comprado";
    toggleButton.addEventListener("click", () => {
      item.comprado = !item.comprado;
      salvarItens();
      atualizarLista();
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-danger";
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", () => {
      items = items.filter((valor) => valor.id !== item.id);
      salvarItens();
      atualizarLista();
    });

    actions.append(toggleButton, removeButton);
    listItem.append(details, actions);
    listElement.appendChild(listItem);
  });
}

// Adiciona um novo item à lista e atualiza o armazenamento e a interface.
function adicionarItem(nome, quantidade) {
  const novoItem = {
    id: Date.now().toString(),
    nome: nome.trim(),
    quantidade: Number(quantidade),
    comprado: false,
  };

  items.push(novoItem);
  salvarItens();
  atualizarLista();
}

// Evento do formulário: adiciona o item quando o usuário envia.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = inputName.value;
  const quantidade = inputQuantity.value;

  if (!nome.trim()) {
    inputName.focus();
    return;
  }

  adicionarItem(nome, quantidade);
  form.reset();
  inputQuantity.value = "1";
  inputName.focus();
});

// Botão para limpar todos os itens da lista.
clearButton.addEventListener("click", () => {
  const confirmacao = confirm("Deseja realmente limpar toda a lista?");
  if (!confirmacao) return;

  items = [];
  salvarItens();
  atualizarLista();
});

// Lógica do botão de ampulheta e do esqueleto em animação.
const hourglassButton = document.getElementById("hourglass-btn");
const skeletonOverlay = document.getElementById("skeleton-overlay");
const skeletonRunner = document.querySelector(".skeleton-runner");
let hourglassClicks = 0;

// A cada 10 cliques, existe 50% de chance de iniciar a animação do esqueleto.
hourglassButton.addEventListener("click", () => {
  hourglassClicks += 1;

  if (hourglassClicks === 10) {
    const shouldShow = Math.random() < 0.5;
    hourglassClicks = 0;

    if (shouldShow) {
      skeletonOverlay.classList.remove("hidden");
      skeletonRunner.classList.add("run-animation");
    }
  }
});

// Quando a animação termina, escondemos o overlay e limpamos a classe de animação.
skeletonRunner.addEventListener("animationend", () => {
  skeletonOverlay.classList.add("hidden");
  skeletonRunner.classList.remove("run-animation");
});

// Inicializa a lista ao abrir a página.
carregarItens();
atualizarLista();
