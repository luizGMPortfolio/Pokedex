import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import './App.css'

import img from './assets/pokebola.png'

function App() {

    const [pokemons, setPokemons] = useState([]); // Estado para armazenar os usuários
    const [Allpokemons, setAllPokemons] = useState([]);
    const [RendersMax, setRendersMax] = useState(1);
    const [RendersMin, setRendersMin] = useState(0);
    const [Gens, setGens] = useState([0, 151, 251, 386, 494, 649, 721, 809, 905, 1025])
    const [error, setError] = useState(null); // Estado para armazenar um possível erro

    const [ref, inView] = useInView({
        threshold: 1 // 0 significa que o callback será executado assim que um pixel for visível
    });

    const [show, setShow] = useState('');
    const [type, setType] = useState('type');
    const [Gen, setGen] = useState('Generations');
    const [Order, setOrder] = useState('Order');
    const [name, setName] = useState('');


    function reset() {
        setType('type');
        setGen('Generations');
        setRendersMax(0);
        setRendersMin(-1);
        setPokemons([]);
    }

    const fetchData = async () => {
        try {
            // Fazendo a requisição para a API e armazenando a resposta
            var info = [];
            for (let j = Gens[RendersMin] + 1; j <= Gens[RendersMax]; j++) {

                const response = await axios.get("https://pokeapi.co/api/v2/pokemon/" + j + "/");
                if (type === 'type') {
                    info.push(response.data);
                }
                else {
                    response.data.types.map(ty => {
                        if (type === ty.type.name) {
                            info.push(response.data);
                        }
                    });
                }
            }
            setPokemons([...pokemons, ...info]);
        } catch (error) {
            setError(error); // Armazena qualquer erro que ocorra
        }
    };

    useEffect(() => {
        const handleScroll = async () => {
            if (inView) {
                if (RendersMax <= 9) {
                    setRendersMin(RendersMax)
                    setRendersMax(RendersMax + 1)
                    fetchData();
                }
            }
        }
        handleScroll();
    }, [inView]);

    function fetchType(type) {
        setType(type);
        setPokemons([]);
    }
    function fetchGen(Gen) {
        setGen(Gen);
        setPokemons([]);
    }
    useEffect(() => {
        if(Gen === 'Generations'){
            setRendersMin(0)
            setRendersMax(1)
            setPokemons([]);
        }
        else{
            setRendersMin(Gen - 1)
            setRendersMax(Gen)
        }
    }, [Gen]);

    useEffect(() => {
        setPokemons([]);
        fetchName();
    }, [name]);

    const fetchName = async () => {
        if (name === '') {
            reset();
            fetchData();
        }
        else {

            try {
                // Fazendo a requisição para a API e armazenando a resposta
                var info = [];
                const response = await axios.get("https://pokeapi.co/api/v2/pokemon/" + name + "/");
                info.push(response.data);
                setPokemons(info);

            } catch (error) {
                setError(error); // Armazena qualquer erro que ocorra
            }
        }
    }


    return (
        <div className='App'>
            <div className='header'>
                <div className='logo'>
                    <img src={img} alt="" />
                </div>

                <div className='menu'>
                    <menu>
                        <li>Pokedex</li>
                        <li>Games</li>
                        <li>References</li>
                    </menu>
                </div>
            </div>
            <div className='search'>
                <div className='input'>
                    <input type="search" placeholder='Search' onChange={(e) => setName(e.target.value)} />
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>

                <div className='filter'>
                    <div className='f-types' onMouseMove={() => setShow('type')} onMouseLeave={() => setShow('')}>
                        <div className={`select ${type != 'type' ? type : 'type'}`}>
                            <h4>{type}</h4>
                        </div>
                        <ul name="options" id="options" className={`options ${show === 'type' ? 'show' : ''}`}>
                            <li value="water" onClick={() => fetchType('type')} className='type'>type</li>
                            <li value="water" onClick={() => fetchType('water')} className='water'>water</li>
                            <li value="glass" onClick={() => fetchType('grass')} className='grass'>grass</li>
                            <li value="fire" onClick={() => fetchType('fire')} className='fire'>fire</li>
                            <li value="fire" onClick={() => fetchType('electric')} className='electric'>electric</li>
                            <li value="Flying" onClick={() => fetchType('flying')} className='flying'>Flying</li>
                            <li value="Fighting" onClick={() => fetchType('fighting')} className='fighting'>Fighting</li>
                            <li value="Poison" onClick={() => fetchType('poison')} className='poison'>Poison</li>
                            <li value="Ground" onClick={() => fetchType('ground')} className='ground'>Ground</li>
                            <li value="Rock" onClick={() => fetchType('rock')} className='rock'>Rock</li>
                            <li value="Psychic" onClick={() => fetchType('psychic')} className='psychic'>Psychic</li>
                            <li value="Ice" onClick={() => fetchType('ice')} className='ice'>Ice</li>
                            <li value="Bug" onClick={() => fetchType('bug')} className='bug'>Bug</li>
                            <li value="Ghost" onClick={() => fetchType('ghost')} className='ghost'>Ghost</li>
                            <li value="Steel" onClick={() => fetchType('steel')} className='steel'>Steel</li>
                            <li value="Dragon" onClick={() => fetchType('dragon')} className='dragon'>Dragon</li>
                            <li value="Dark" onClick={() => fetchType('dark')} className='dark'>Dark</li>
                            <li value="Fairy" onClick={() => fetchType('fairy')} className='fairy'>Fairy </li>
                        </ul>
                    </div>

                    <div className='f-generations' onMouseMove={() => setShow('Generations')} onMouseLeave={() => setShow('')}>
                        <div className={`select ${Gen != 0 ? Gen : ''} Generations`}>
                            <h4>{Gen != 'Generations' ? `${Gen}° Gen` : 'Generations'}</h4>
                        </div>
                        <ul name="options" id="options" className={`options ${show === 'Generations' ? 'show' : ''}`}>
                            <li value="1" onClick={() => fetchGen('Generations')} className=''>Generations</li>
                            <li value="1" onClick={() => fetchGen(1)} className=''>1° Gen</li>
                            <li value="2" onClick={() => fetchGen(2)} className=''>2° Gen</li>
                            <li value="3" onClick={() => fetchGen(3)} className=''>3° Gen</li>
                            <li value="4" onClick={() => fetchGen(4)} className=''>4° Gen</li>
                            <li value="5" onClick={() => fetchGen(5)} className=''>5° Gen</li>
                            <li value="6" onClick={() => fetchGen(6)} className=''>6° Gen</li>
                            <li value="7" onClick={() => fetchGen(7)} className=''>7° Gen</li>
                            <li value="8" onClick={() => fetchGen(8)} className=''>8° Gen</li>
                            <li value="9" onClick={() => fetchGen(9)} className=''>9° Gen</li>
                        </ul>
                    </div>

                    <div className='f-order' onMouseMove={() => setShow('Order')} onMouseLeave={() => setShow('')}>
                        <div className={`select ${Order != 'Order' ? Order : 'Order'} Order`}>
                            <h4>{Order}</h4>
                        </div>
                        <ul name="options" id="options" className={`options ${show === 'Order' ? 'show' : ''}`}>
                            <li value="Order" onClick={() => setOrder('Order')}>Order</li>
                            <li value="number" onClick={() => setOrder('by number')}>By number</li>
                            <li value="cresente" onClick={() => setOrder('Cresente')}>cresente</li>
                            <li value="decresente" onClick={() => setOrder('Degresente')}>degresente</li>
                            <li value="Alfabect" onClick={() => setOrder('Alfabetc')}>Alfabetc</li>
                        </ul>

                    </div>

                    <input type='checkbox' />
                    <label htmlFor="">Only Legendary</label>
                    <input type="checkbox" />
                    <label htmlFor="">Only Semi-Legendary</label>
                </div>

            </div>
            {pokemons && pokemons.map(pokemon => (
                <div className="card">
                    <div className='img'>
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
            <div ref={ref}>Carregando mais itens...</div>
        </div>
    );
}

export default App;