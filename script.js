const pizzas = [
    { nome: "Marguerita", preco: "R$ 40,00" },
    { nome: "Pepperoni", preco: "R$ 50,00" },
    { nome: "Atum", preco: "R$ 40,00" },
    { nome: "Palmito", preco: "R$ 59,00" },
    { nome: "Frango com catupiry", preco: "R$ 59,00" },
    { nome: "Brigadeiro com confete", preco: "R$ 70,00" }
];

let carrinho = [];

document.addEventListener("DOMContentLoaded", () => {
    const lupa = document.querySelector("#lupa");
    const carrinhoIcone = document.querySelector("#carrinho");
    const body = document.querySelector("body");

    const campoBusca = document.createElement("div");
    campoBusca.classList.add("campo-busca");
    campoBusca.style.display = "none";
    campoBusca.innerHTML = `
        <input type="text" id="buscaInput" placeholder="Buscar pizza...">
        <div id="resultadoBusca" class="resultado-busca"></div>
    `;
    body.appendChild(campoBusca);

    const janelaCarrinho = document.createElement("div");
    janelaCarrinho.classList.add("janela-carrinho");
    janelaCarrinho.style.display = "none";
    janelaCarrinho.innerHTML = `
        <h3>Seu Carrinho</h3>
        <ul id="listaCarrinho" class="lista-carrinho"></ul>
    `;
    body.appendChild(janelaCarrinho);

    function atualizarCarrinho() {
        const lista = document.querySelector("#listaCarrinho");
        lista.innerHTML = "";

        if (carrinho.length === 0) {
            lista.innerHTML = "<li>O carrinho está vazio.</li>";
            return;
        }

        carrinho.forEach((item, index) => {
            const li = document.createElement("li");
            const valorNum = parseFloat(item.preco.replace(/[R$\s]/g, "").replace(",", "."));
            const subtotal = (valorNum * item.quantidade).toFixed(2).replace(".", ",");
            li.innerHTML = `
                ${item.nome} - ${item.preco} x ${item.quantidade} = R$ ${subtotal}
                <button class="removerCarrinho" data-index="${index}">Remover 1</button>
            `;
            lista.appendChild(li);
        });

        document.querySelectorAll(".removerCarrinho").forEach(botao => {
            botao.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                if (carrinho[index].quantidade > 1) {
                    carrinho[index].quantidade--;
                } else {
                    carrinho.splice(index, 1);
                }
                atualizarCarrinho();
            });
        });

        const total = carrinho.reduce((acc, item) => {
            let valorNum = parseFloat(item.preco.replace(/[R$\s]/g, "").replace(",", "."));
            return acc + valorNum * item.quantidade;
        }, 0);

        const totalFormatado = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const totalDiv = document.createElement("div");
        totalDiv.id = "totalCarrinho";
        totalDiv.textContent = `Total: ${totalFormatado}`;
        lista.appendChild(totalDiv);

        if (!document.querySelector("#finalizarPedido")) {
            const botaoFinalizar = document.createElement("button");
            botaoFinalizar.id = "finalizarPedido";
            botaoFinalizar.innerHTML = `
                <img src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="WhatsApp" style="width:24px; margin-right: 8px;">
                Finalizar Pedido
            `;
            lista.appendChild(botaoFinalizar);

            botaoFinalizar.addEventListener("click", () => {
                const mensagem = carrinho.map(item => `• ${item.nome} - ${item.preco} x ${item.quantidade}`).join('\n');
                const texto = `Olá! Gostaria de fazer o seguinte pedido:\n\n${mensagem}\n\nTotal: ${totalFormatado}\n\nEndereço: (adicione aqui)\nForma de pagamento: (adicione aqui)`;
                const numero = "11937688927";
                const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
                window.open(url, "_blank");
            });
        }
    }

    // Atualizei esta função para aumentar quantidade se pizza já estiver no carrinho
    function adicionarAoCarrinho(nome, preco) {
        const itemExistente = carrinho.find(p => p.nome === nome);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            // Formata preco para o formato R$ xx,xx
            const precoFormatado = preco.includes("R$") ? preco : `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
            carrinho.push({ nome, preco: precoFormatado, quantidade: 1 });
        }
        atualizarCarrinho();
        alert(`${nome} adicionada ao carrinho!`);
    }

    // Liga evento para botões já no HTML com class adicionarAoCarrinho
    document.querySelectorAll('.adicionarAoCarrinho').forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const nome = botao.dataset.nome;
            const preco = botao.dataset.preco;
            adicionarAoCarrinho(nome, preco);
        });
    });

    lupa.addEventListener("click", () => {
        if (campoBusca.style.display === "none") {
            campoBusca.style.display = "block";
            janelaCarrinho.style.display = "none";
            document.querySelector("#buscaInput").focus();
        } else {
            campoBusca.style.display = "none";
        }
    });

    carrinhoIcone.addEventListener("click", () => {
        if (janelaCarrinho.style.display === "none") {
            janelaCarrinho.style.display = "block";
            campoBusca.style.display = "none";
            atualizarCarrinho();
        } else {
            janelaCarrinho.style.display = "none";
        }
    });

    const buscaInput = document.querySelector("#buscaInput");

    buscaInput.addEventListener("input", (e) => {
        const termo = e.target.value.toLowerCase();
        const resultado = pizzas.filter(pizza => pizza.nome.toLowerCase().includes(termo));
        const container = document.querySelector("#resultadoBusca");
        container.innerHTML = "";

        if (resultado.length === 0) {
            container.innerHTML = "<p>Nenhuma pizza encontrada.</p>";
            return;
        }

        resultado.forEach(pizza => {
            const item = document.createElement("div");
            item.classList.add("item-busca");
            item.innerHTML = `
                <strong>${pizza.nome}</strong> - ${pizza.preco}
                <button class="adicionarCarrinho">Adicionar</button>
            `;
            container.appendChild(item);

            item.querySelector("button").addEventListener("click", () => {
                adicionarAoCarrinho(pizza.nome, pizza.preco);
            });
        });
    });

    buscaInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const primeiroBotao = document.querySelector(".adicionarCarrinho");
            if (primeiroBotao) primeiroBotao.click();
        }
    });
});
