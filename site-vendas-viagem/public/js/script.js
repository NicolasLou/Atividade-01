// public/js/script.js
function calcularTotal() {
    const quantidade = document.getElementById('quantidade').value;
    const preco = 5000;  // Preço fixo para o pacote de exemplo
    const total = quantidade * preco;
    document.getElementById('total').innerText = `Valor Total: R$ ${total.toFixed(2)}`;
}
