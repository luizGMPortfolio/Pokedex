import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTrail, animated } from 'react-spring';
import axios from 'axios';
import './App.css'

import img from './assets/pokebola.png'

function App() {

    const [pokemons, setPokemons] = useState([]); // Estado para armazenar os usuários

    const trail = useTrail(pokemons.length, {
        from: {
            opacity: 0,
            transform: 'translateX(-20px)',
            contentvisibility: 'hidden'
        }, // Estado inicial da animação
        to: { opacity: 1, transform: 'translateX(0px)' },     // Estado final da animação
        delay: 1000,                                         // Atraso inicial para começar a animação
        config: { duration: 200 }, // Duração de cada animação
    });

    const [filter, setFilter] = useState(false);
    const [RendersMax, setRendersMax] = useState(1);
    const [Gens, setGens] = useState([1, 151, 251, 386, 494, 649, 721, 809, 905, 1025]);
    const [Gen, setGen] = useState('Generations');
    const [error, setError] = useState(null); // Estado para armazenar um possível erro
    const [ref, inView] = useInView({
        threshold: 1 // 0 significa que o callback será executado assim que um pixel for visível
    });
    const [show, setShow] = useState('');
    const [type, setType] = useState('type');
    const [Region, setRegion] = useState('Region');
    const [name, setName] = useState('');

    const [animation, setAnimation] = useState('');


    function reset() {
        setRendersMax(1);
        setPokemons([]);
    }

    useEffect(() => {
        reset();
        if (type != 'type' || Gen != 'Generations') {
            setFilter(true);
            reset();
        }
        else {
            reset();
            setFilter(false);
        }
    }, [Gen, type]);


    const fetchData = async () => {
        try {
            // Fazendo a requisição para a API e armazenando a resposta
            var info = [];
            for (let j = 1; j <= 30; j++) {

                const response = await axios.get("https://pokeapi.co/api/v2/pokemon/" + (j + pokemons.length) + "/");
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
    const fetchFilter = async (RendersMin, RendersMax) => {
        try {
            // Fazendo a requisição para a API e armazenando a resposta
            var info = [];
            for (let j = RendersMin; j <= RendersMax; j++) {

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
                if (!filter) {
                    fetchData();
                }
                else if (filter) {
                    if (name === '') {
                        if (Gen === 'Generations') {
                            fetchFilter(Gens[RendersMax - 1] + 1, Gens[RendersMax]);
                            setRendersMax(RendersMax + 1)
                        } else {
                            if (pokemons.length === 0) {
                                fetchFilter(Gens[Gen - 1] + 1, Gens[Gen]);
                            }

                        }
                    }

                }

            }
        }
        handleScroll();
    }, [inView]);


    useEffect(() => {
        if (pokemons.length < 20 && pokemons.length != 0 && filter && name === '' || type === 'dark') {
            fetchFilter(Gens[RendersMax - 1] + 1, Gens[RendersMax]);
            setRendersMax(RendersMax + 1)
        }
    }, [pokemons])

    const fetchName = async () => {

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
    useEffect(() => {
        if (name != '') {
            setFilter(true);
            reset();
            fetchName();
        }
        else {
            setFilter(false);
            reset();
            fetchData();
        }
    }, [name]);

    const Animation = (index) => {
        const element = document.getElementById(index);
        element.classList.add('card-roll');
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
                    <input type="search" placeholder='Search' value={name} onChange={(e) => setName(e.target.value)} />
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <i class="fa-solid fa-rotate-right" ></i>
                </div>

                <div className='filter'>
                    <div className='f-types' onMouseMove={() => setShow('type')} onMouseLeave={() => setShow('')}>
                        <div className={`select ${type != 'type' ? type : 'type'}`}>
                            <h4>{type}</h4>
                        </div>
                        <ul name="options" id="options" className={`options ${show === 'type' ? 'show' : ''}`}>
                            <li value="water" onClick={() => setType('type')} className='type'>type</li>
                            <li value="water" onClick={() => setType('water')} className='water'>water</li>
                            <li value="glass" onClick={() => setType('grass')} className='grass'>grass</li>
                            <li value="fire" onClick={() => setType('fire')} className='fire'>fire</li>
                            <li value="fire" onClick={() => setType('electric')} className='electric'>electric</li>
                            <li value="Flying" onClick={() => setType('flying')} className='flying'>Flying</li>
                            <li value="Fighting" onClick={() => setType('fighting')} className='fighting'>Fighting</li>
                            <li value="Poison" onClick={() => setType('poison')} className='poison'>Poison</li>
                            <li value="Ground" onClick={() => setType('ground')} className='ground'>Ground</li>
                            <li value="Rock" onClick={() => setType('rock')} className='rock'>Rock</li>
                            <li value="Psychic" onClick={() => setType('psychic')} className='psychic'>Psychic</li>
                            <li value="Ice" onClick={() => setType('ice')} className='ice'>Ice</li>
                            <li value="Bug" onClick={() => setType('bug')} className='bug'>Bug</li>
                            <li value="Ghost" onClick={() => setType('ghost')} className='ghost'>Ghost</li>
                            <li value="Steel" onClick={() => setType('steel')} className='steel'>Steel</li>
                            <li value="Dragon" onClick={() => setType('dragon')} className='dragon'>Dragon</li>
                            <li value="Dark" onClick={() => setType('dark')} className='dark'>Dark</li>
                            <li value="Fairy" onClick={() => setType('fairy')} className='fairy'>Fairy </li>
                        </ul>
                    </div>

                    <div className='f-generations' onMouseMove={() => setShow('Generations')} onMouseLeave={() => setShow('')}>
                        <div className={`select ${Gen != 0 ? Gen : ''} Generations`}>
                            <h4>{Gen != 'Generations' ? `${Gen}° Gen` : 'Generations'}</h4>
                        </div>
                        <ul name="options" id="options" className={`options ${show === 'Generations' ? 'show' : ''}`}>
                            <li value="1" onClick={() => setGen('Generations')} className=''>Generations</li>
                            <li value="1" onClick={() => setGen(1)} className=''>1° Gen</li>
                            <li value="2" onClick={() => setGen(2)} className=''>2° Gen</li>
                            <li value="3" onClick={() => setGen(3)} className=''>3° Gen</li>
                            <li value="4" onClick={() => setGen(4)} className=''>4° Gen</li>
                            <li value="5" onClick={() => setGen(5)} className=''>5° Gen</li>
                            <li value="6" onClick={() => setGen(6)} className=''>6° Gen</li>
                            <li value="7" onClick={() => setGen(7)} className=''>7° Gen</li>
                            <li value="8" onClick={() => setGen(8)} className=''>8° Gen</li>
                            <li value="9" onClick={() => setGen(9)} className=''>9° Gen</li>
                        </ul>
                    </div>

                    <div className='f-Region' onMouseMove={() => setShow('Region')} onMouseLeave={() => setShow('')}>
                        <div className={`select ${Region != 'Region' ? Region : 'Region'} Region`}>
                            <h4>{Region}</h4>
                        </div>
                        <ul name="options" id="options" className={`options ${show === 'Region' ? 'show' : ''}`}>
                            <li value="Region" onClick={() => setRegion('Region')}>Region</li>
                            <li value="number" onClick={() => setRegion('by number')}>By number</li>
                            <li value="cresente" onClick={() => setRegion('Cresente')}>cresente</li>
                            <li value="decresente" onClick={() => setRegion('Degresente')}>degresente</li>
                            <li value="Alfabect" onClick={() => setRegion('Alfabetc')}>Alfabetc</li>
                        </ul>

                    </div>

                    <input type='checkbox' />
                    <label htmlFor="">Only Legendary</label>
                </div>

            </div>
            <div className='results'>
                {pokemons && trail.map((props, index) => (
                    <animated.div key={index} style={props}>
                        <div className='card'>
                            <div className={`card-inner`} onClick={() => Animation(index)} key={index} id={index}>
                                <div class="card-front">
                                    <div className='img'>
                                        <img src={pokemons[index].sprites.other["official-artwork"].front_default} alt="" />
                                    </div>
                                    <div className='info'>
                                        <div className='container'>
                                            <div className='status'>
                                                <h3>{pokemons[index].name}</h3>
                                                <div className='types'>
                                                    {pokemons[index].types.map(type => (
                                                        <div className={`type1 ${type.type.name}`}>
                                                            <span>{type.type.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='num'>
                                            <span>N°{pokemons[index].id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-back">
                                    <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fill/w_1024,h_1420/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQyMCIsInBhdGgiOiJcL2ZcLzRmNzcwNWVjLThjNDktNGVlZC1hNTZlLWMyMWYzOTg1MjU0Y1wvZGFoNDNjeS1hOGUxMjFjYi05MzRhLTQwZjYtOTdjNy1mYTJkNzcxMzBkZDUucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9GzaYS7sd8RPY5FlHca09J9ZQZ9D9zI69Ru-BsbkLDA" alt="" />
                                </div>
                            </div>

                        </div>
                    </animated.div>

                ))}
            </div>
            <div ref={ref}>Carregando itens...</div>
        </div>
    );
}

export default App;