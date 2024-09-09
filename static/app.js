class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
    };

    this.state = false;
    this.messages = [];
  }

  display() {
    const { openButton, chatBox, sendButton } = this.args;

    openButton.addEventListener("click", () => this.toggleState(chatBox));

    sendButton.addEventListener("click", () => this.onSendButton(chatBox));

    const node = chatBox.querySelector("input");
    node.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        this.onSendButton(chatBox);
      }
    });
  }

  toggleState(chatbox) {
    this.state = !this.state;

    if (this.state) {
      chatbox.classList.add("chatbox--active");
    } else {
      chatbox.classList.remove("chatbox--active");
    }
  }

  onSendButton(chatbox, message = null) {
    var textField = chatbox.querySelector("input");
    let text1 = message || textField.value;
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "Usuario", message: text1 };
    this.messages.push(msg1);

    //Primera opcion de ruta, entorno local:
    //"http://127.0.0.1:5000/predict"

    //Segunda opcion de ruta, entornos variados:
    //$SCRIPT_ROOT + "/predict"

    fetch($SCRIPT_ROOT + "/predict", {
      //En la linea de arriba se cambia el codigo dependiendo de en que entorno se vaya a trabajar con el chat
      method: "POST",
      body: JSON.stringify({ message: text1 }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        let msg2 = { name: "Paulina", message: r.answer };
        this.messages.push(msg2);
        this.updateChatText(chatbox);

        // Verificar si la respuesta tiene botones
        if (r.buttons && Array.isArray(r.buttons)) {
          this.generateButtons(chatbox, r.buttons);
        }

        textField.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText(chatbox);
        textField.value = "";
      });
  }

  updateChatText(chatbox) {
    var html = "";
    this.messages
      .slice()
      .reverse()
      .forEach((item) => {
        if (item.name === "Paulina") {
          html += `<div class="messages__item messages__item--visitor">${item.message}</div>`;
        } else {
          html += `<div class="messages__item messages__item--operator">${item.message}</div>`;
        }
      });

    const chatmessage = chatbox.querySelector(".chatbox__messages");
    chatmessage.innerHTML = html;
  }

  generateButtons(chatbox, buttons) {
    const botonesContainer = chatbox.querySelector("#botones-container");
    botonesContainer.innerHTML = ""; // Limpiar botones anteriores

    console.log("Generando botones:", buttons);

    buttons.forEach((button) => {
      const btn = document.createElement("button");
      btn.textContent = button.text;
      btn.value = button.value;
      btn.classList.add("boton-opcion"); // Clase para estilos

      btn.addEventListener("click", () => {
        this.onSendButton(chatbox, button.value); // Enviar el valor del botón como mensaje
        botonesContainer.innerHTML = ""; // Eliminar botones después de la selección
      });

      botonesContainer.appendChild(btn);
      console.log("Botón añadido:", button.text);
    });
  }
}

// Ocultar y mostrar completamente la ventana de chat
document.getElementById("buttonchat").addEventListener("click", function () {
  const chatwindow = document.getElementById("chatwindow");

  if (chatwindow.classList.contains("show")) {
    chatwindow.classList.remove("show");
    chatwindow.addEventListener(
      "transitionend",
      function () {
        if (!chatwindow.classList.contains("show")) {
          chatwindow.style.display = "none";
        }
      },
      { once: true }
    );
  } else {
    chatwindow.style.display = "block";
    requestAnimationFrame(() => {
      chatwindow.classList.add("show");
    });
  }

  console.log($SCRIPT_ROOT);
});

const chatbox = new Chatbox();
chatbox.display();
