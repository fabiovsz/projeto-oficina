'use strict'

/*
Realiza a abertura e fechamento do modal
*/
const openModal = () => document.getElementById('modal').classList.add('active');

const closeModal = () => {
    document.getElementById('modal').classList.remove('active');
    clearFields();
}

var form = document.getElementById('form');

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_orcamento')) ?? []
const setLocalStorage = (dbOrcamento) => localStorage.setItem('db_orcamento', JSON.stringify(dbOrcamento))


/*
CRUD
*/
const createOrcamento = (orcamento) => {
    const dbOrcamento = getLocalStorage();
    dbOrcamento.push(orcamento);
    setLocalStorage(dbOrcamento);
}

const readOrcamento = () => getLocalStorage();

const updateOrcamento = (index, orcamento) => {
    const dbOrcamento = readOrcamento();
    dbOrcamento[index] = orcamento;
    setLocalStorage(dbOrcamento);
}

const deleteOrcamento = (index) => {
    const dbOrcamento = readOrcamento();
    dbOrcamento.splice(index, 1);
    setLocalStorage(dbOrcamento);
}

/*
Valida os campos do input
*/
const validFields = () => {
    return document.getElementById('form').reportValidity()
}


/*
Salva os dados no LocalStorage
*/
const salvarOrcamento = () => {
    if (validFields()) {
        const orcamento = {
            cliente: document.getElementById('cliente').value,           
            telefone: document.getElementById('telefone').value,
            data: document.getElementById('data').value,
            vendedor: document.getElementById('vendedor').value,
            valor: document.getElementById('valor').value,
            desc: document.getElementById('desc').value           
        }

        const index = document.getElementById('cliente').dataset.index;
        if(index == 'new') {
            createOrcamento(orcamento);
            updateTable();
            closeModal();
        }
        else {
            updateOrcamento(index, orcamento);
            updateTable();
            closeModal();
        }
        
    }    
    
}

/*
Cria a tr dos orçamentos e insere na tbody
*/
const createTr = (orcamento, index) => {
    const newTr = document.createElement('tr');
    newTr.innerHTML = `
        <td>${orcamento.cliente}</td>
        <td>${orcamento.telefone}</td>
        <td>${orcamento.data}</td>
        <td>${orcamento.vendedor}</td>
        <td>${orcamento.valor}</td>
        <td>${orcamento.desc}</td>
        <td>
            <button type="button" class="btn-editar" id="edit-${index}">Editar</button>
            <button type="button" class="btn-excluir" id="delete-${index}">Excluir</button>
        </td>       
    `
    document.querySelector('#tabela-orcamentos>tbody').appendChild(newTr);
}

/*
Atualiza a tabela ao salvar
*/

const updateTable = () => {
    const dbOrcamento = readOrcamento();
    clearTable();
    dbOrcamento.forEach(createTr);

}

/*
Limpa a tabela antes do update
*/
const clearTable = () => {
    const rows = document.querySelectorAll('#tabela-orcamentos>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

/*
Limpa os dados após salvar no Local Storage
*/
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-input');
    fields.forEach(field => field.value = '');
}

/*
Preenche os campos do input
*/
const fillFields = (orcamento) => {
    document.getElementById('cliente').value = orcamento.cliente;
    document.getElementById('telefone').value = orcamento.telefone;
    document.getElementById('data').value = orcamento.data;
    document.getElementById('vendedor').value = orcamento.vendedor;
    document.getElementById('valor').value = orcamento.valor;
    document.getElementById('desc').value = orcamento.desc;
    document.getElementById('cliente').dataset.index = orcamento.index;
}

/*
Realiza a função de editar o orçamento já cadastrado
*/
const editOrcamento = (index) => {
    const orcamento = readOrcamento()[index];
    orcamento.index = index;
    fillFields(orcamento);
    openModal();
}

/*
Edita e deleta os orçamentos
*/ 
const editDeleteOrcamento = (event) => {
    if (event.target.type== 'button') {
        const [action, index] = event.target.id.split('-');
        if(action == 'edit') {
            editOrcamento(index);
        }
        else {
            const orcamento = readOrcamento()[index];
            const response = confirm(`Deseja excluir o orçamento do(a) cliente ${orcamento.cliente}?`);
            if (response) {
                deleteOrcamento(index);
                updateTable();
            }           
        }
    }   
    
}

updateTable();


/*
Eventos de click do sistema
*/
document.getElementById('salvar').addEventListener("click", salvarOrcamento);
document.getElementById('adicionar').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.querySelector('#tabela-orcamentos>tbody').addEventListener('click', editDeleteOrcamento);