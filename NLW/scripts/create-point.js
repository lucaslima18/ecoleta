//para buscar um seletor, para todos use ALL
//document.querySelectorALL("form input")

//fetch --> retorna uma promisse .then --> então execute uma função que recebe o response
//innerHTML --> escrever html
//event.target --> de onde foi disparado o evento
//const indexOfSelectedState = event.target.selectedIndex --> pega o option selecionado

function populateUFs() {
	const ufselect = document.querySelector("select[name=uf]")
	fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
	.then((res) => {
		return res.json()
	}).then((states) => {
		for( const state of states ){
			ufselect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
		}
	})
}

function populateCities(event, city_id) {
	const citiesSelect = document.querySelector("select[name=city]")
	const stateInput = document.querySelector("input[name=state]")

	const indexOfSelectedState = event.target.selectedIndex
	stateInput.value = event.target.options[indexOfSelectedState].text

	const ufvalue = event.target.value
	const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufvalue}/municipios`
	citiesSelect.innerHTML = "<option value>Selecione a Cidade</option>"
	citiesSelect.disabled = true

	fetch(url)
	.then((res) => {
		return res.json()
	})
	.then((cities) => {
		

		for( const city of cities ){
			citiesSelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
		}

		citiesSelect.disabled = false
	})
}

populateUFs()

document
	.querySelector("select[name=uf]")
	//passei uma função por referencia para executar mais tarde
	.addEventListener("change", populateCities)



//items de coleta
const itemsToCollect = document.querySelectorAll(".items-grid li")

for(const item of itemsToCollect) {
	item.addEventListener("click", handleSelectedItem)
}

let selectedItems = []
const collectedItems = document.querySelector("input[name=items]")

function handleSelectedItem(event) {
	//add or remove uma classe javascript --> add(), remove(), toggle(adicionar ou remover)
	const itemLi = event.target
	itemLi.classList.toggle("selected")


	const itemId = itemLi.dataset.id
	console.log(event.target.dataset.id)

	//verificar se existem items selecionados
	//pegar items selecionados
	const alredySelected = selectedItems.findIndex( (item) => {
		return item == itemId 
	})

	console.log(alredySelected)

	//se ja estiver selecionado, tirar da seleção, se ele for >= 0 quer dizer que o alredySelected retornou algo
	//se não estiver selecionado, adicionar a seleção
	if(alredySelected != -1) {
		const filteredItems = selectedItems.filter( (item) => {
			const itemIsDifferent = item != itemId
			return itemIsDifferent
		})

		console.log(filteredItems)
		selectedItems = filteredItems

	} else {
		selectedItems.push(itemId)
	}

	console.log(selectedItems)

	//adicionar o campo escondido com os items selecionados
	collectedItems.value = selectedItems

}