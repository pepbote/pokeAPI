const button = document.getElementById("submit");
let selectedCards = [];
let generatedPokemonIds = new Set(); 
const filter = document.getElementById('filtrarNombre');

button.addEventListener('click', generarPokemons);

filter.addEventListener('input', function () {
    filtrar();
});

function filtrar() {
    const filtrarInput = filter.value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const nombrePokemon = card.querySelector('.name').textContent;

        if (nombrePokemon.includes(filtrarInput)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function seleccionado(card) {
    const index = selectedCards.indexOf(card);

    if (index !== -1) {
        selectedCards.splice(index, 1);
        card.classList.remove('selected', 'winner'); 
    } else {
        if (selectedCards.length < 2) {
            selectedCards.push(card);
            card.classList.add('selected');
        }
    }

    const result = document.getElementById('result');

    if (selectedCards.length === 2) {
        const [attacker, defender] = selectedCards;
        attacker.classList.remove('winner');
        defender.classList.remove('winner');
        const attackValue = parseInt(attacker.querySelector('.stats').textContent.split(':')[1].trim(), 10);
        const defenseValue = parseInt(defender.querySelector('.stats').textContent.split('|')[1].split(':')[1].trim(), 10);

        let resultMessage = '';
        let ganadora;

        if (attackValue > defenseValue) {
            resultMessage = `${attacker.querySelector('.name').textContent} gana el combate`;
            ganadora = attacker.cloneNode(true);
            attacker.classList.add('winner');
            ganadora.classList.remove('selected', 'hover');
        } else if (attackValue < defenseValue) {
            resultMessage = `${defender.querySelector('.name').textContent} gana el combate`;
            ganadora = defender.cloneNode(true);
            defender.classList.add('winner');
            ganadora.classList.remove('selected', 'hover');
        } else {
            resultMessage = 'El combate queda en empate';
        }

        while (result.firstChild) {
            result.removeChild(result.firstChild);
        }

        const mensajeElement = document.createElement('p');
        mensajeElement.textContent = resultMessage;
        result.appendChild(mensajeElement);
        result.appendChild(ganadora);

        result.style.display = 'flex';
    } else {
        result.innerHTML = '';
        result.style.display = 'none';
    }
}


function generarPokemons() {
    let num = parseInt(document.getElementById('numPokemons').value, 10);
    const out = document.getElementById('cards');

    out.innerHTML = '';
    generatedPokemonIds.clear();  

    for (let i = 0; i < num; i++) {
        let numero;
        do {
            numero = Math.floor(Math.random() * 800) + 1;
        } while (generatedPokemonIds.has(numero));  

        generatedPokemonIds.add(numero);  

        console.log(numero);
        fetch(`https://pokeapi.co/api/v2/pokemon/${numero}`)
            .then(x => x.json())
            .then(poke => {
                const temp = document.getElementById('template');
                const clonedTemplate = temp.content.cloneNode(true);

                let card = clonedTemplate.querySelector('.card');

                card.setAttribute('id', poke.id);
                card.addEventListener('click', () => {
                    seleccionado(card);
                });

                let name = clonedTemplate.querySelector('.name');
                name.textContent = poke.name;

                let img = clonedTemplate.querySelector('.img');
                img.setAttribute('src', poke.sprites.front_default);

                let type = clonedTemplate.querySelector('.type');
                const arrayType = poke.types.map(type => type.type.name);
                type.textContent = arrayType.join(" | ");

                let stats = clonedTemplate.querySelector('.stats');
                poke.stats.forEach(stat => {
                    if (stat.stat.name == "attack") {
                        stats.textContent = "A: " + stat.base_stat;
                    }
                    if (stat.stat.name == "defense") {
                        stats.textContent += " | D: " + stat.base_stat;
                    }
                });

                out.appendChild(clonedTemplate);
            });
    }
}