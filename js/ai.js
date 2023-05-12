const CLIENT_TOKEN = "MYA6XFIQFHPFBABLW65WOGIUEW2BB4RP";
const auth = "Bearer " + CLIENT_TOKEN;
const button = document.querySelector("#button");
const container = document.querySelector("#container");

const odpowiedzi = {
  przywitanie: [
    "Dzień dobry! Jestem Twój chatbot - Wieczorkiewicz AI. Czego potrzebujesz?",
    "Witaj! Jestem twoim wirtualnym asystentem stworzonym przez Wieczorkiewicz Company. Jak mogę ci pomóc dzisiaj?",
    "Hej, witaj w Wieczorkiewicz AI! Jesteśmy tu, aby rozświetlić twoje życie informacjami i zabawnymi odpowiedziami. Czego dziś potrzebujesz?",
  ],
  small_talk: [
    "Hej! Czuję się dobrze, dzięki. A Ty?",
    "Dzięki za zapytanie! Czuję się dobrze i jestem gotów na pracę.",
    "Jako sztuczna inteligencja, nie mam fizycznych odczuć, ale czuję się dobrze i gotów na pracę.",
  ],
  about: [
    "Jestem chatbotem o nazwie Wieczorkiewicz AI. Potrafię przywitać się użytkownika oraz odpowiedzieć na pytania typu jak ci mija dzień. Dodatkowo, oferuję funkcjonalność wykonywania prostych działań matematycznych, takich jak dodawanie, odejmowanie, mnożenie i dzielenie",
    "Witaj! Jestem Chatbot Wieczorkiewicz AI. Moim zadaniem jest prowadzenie rozmów i pomaganie użytkownikom w rozwiązywaniu prostych zadań matematycznych. Możesz pytać mnie o różne rzeczy, a ja postaram się na nie odpowiedzieć.",
    "Witaj! Jestem Chatbot Wieczorkiewicz AI. Jako program komputerowy, potrafię prowadzić rozmowy z użytkownikami i odpowiadać na różnego rodzaju pytania. Posiadam również umiejętności w rozwiązywaniu prostych zadań matematycznych.",
  ],
  blad: [
    "To pytanie wydaje się być poza moim zakresem. Przepraszam, jeśli nie mogę dostarczyć ci pożądanej odpowiedzi.",
    "Przepraszam za nieporozumienie. Jako model językowy AI, nie posiadam rzeczywistej świadomości ani możliwości posiadania informacji.",
    "Przepraszam, nie mam odpowiedzi na to pytanie. Moje możliwości są ograniczone do dostępnej wiedzy i informacji.",
  ],
  random: function (array) {
    return array[Math.floor(Math.random() * array.length)];
  },
};

//funkcje
const message = (typ, tresc) => {
  const div = document.createElement("div");
  div.innerHTML = "<div class='message " + typ + "'>" + tresc + "</div>";
  container.appendChild(div);
};
button.onclick = () => {
  const input = document.querySelector("#message").value;
  const q = encodeURIComponent(input);
  const uri = "https://api.wit.ai/message?v=20230215&q=" + q;
  message("outgoing", input);
  fetch(uri, { headers: { Authorization: auth } })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.intents.length == 0) {
        message("incoming", odpowiedzi.random(odpowiedzi.blad));
        return;
      }
      let response = res.intents[0].name;
      if (response == "przywitanie")
        message("incoming", odpowiedzi.random(odpowiedzi.przywitanie));
      else if (response == "small_talk")
        message("incoming", odpowiedzi.random(odpowiedzi.small_talk));
      else if (response == "matematyka") {
        let dzialanie =
          res.entities["wit$math_expression:math_expression"][0].value;
        message("incoming", dzialanie + " = " + eval(dzialanie));
      } else if (response == "about")
        message("incoming", odpowiedzi.random(odpowiedzi.about));
      else if (response == "data") {
        const date = new Date(res.entities["wit$datetime:datetime"][0].value);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Add 1 because getMonth() returns 0-based month (January = 0)
        const year = date.getFullYear();

        const formattedDate = `${day < 10 ? "0" + day : day}.${
          month < 10 ? "0" + month : month
        }.${year}`;
        message("incoming", formattedDate);
      }
      container.scrollTop = container.scrollHeight;
    });
};
