import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

import img from './assets/pokebola.png'

function App() {

    const [pokemons, setPokemons] = useState([]); // Estado para armazenar os usuários
    const [error, setError] = useState(null); // Estado para armazenar um possível erro

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fazendo a requisição para a API e armazenando a resposta
                const info = [];
                for (let i = 1; i <= 151; i++) {
                    const response = await axios.get("https://pokeapi.co/api/v2/pokemon/" + i + "/");
                    info.push(response.data);
                }
                console.log(info)
                setPokemons(info)
                const info1 = [];
                for (let j = 1; j <= 1025; j++) {
                    const response1 = await axios.get("https://pokeapi.co/api/v2/pokemon/" + j + "/");
                    info1.push(response1.data);
                }
                console.log(info1)
                setPokemons(info1)

            } catch (error) {
                setError(error); // Armazena qualquer erro que ocorra
            }
        };

        fetchData(); // Chama a função fetchData ao montar o componente
    }, []); // Array de dependências vazio significa que o efeito roda apenas uma vez

    return (
        <div className='App'>
            <div className='menu'>
                <img src={img} alt="" />
            </div>
            <div className='search'>
                <input type="search" />
                <i class="fa-solid fa-magnifying-glass"></i>
                <select name="types" id="types">
                    <option value="all" selected>All</option>
                    <option value="water">water</option>
                    <option value="glass">glass</option>
                    <option value="fire">fire</option>
                    <option value="fire">electric</option>
                </select>
            </div>
            {pokemons && pokemons.map(pokemon => (
                <div className={`card`}>
                    <div className='img'>
                        {console.log(pokemon.sprites.other)}
                        <img src={pokemon.sprites.other["official-artwork"].front_default} alt="" />
                    </div>

                    <div className='info'>
                        <div className='container'>
                            <div className='status'>
                                <h3>{pokemon.name}</h3>
                                <div className='types'>
                                    {pokemon.types.map(type => (
                                        <div className={`type1 ${type.type.name}`}>
                                            <span>{type.type.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='num'>
                            <span>N°{pokemon.id}</span>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default App;