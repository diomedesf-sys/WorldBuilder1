
export interface PoemLine {
    id: number;
    title?: string;
    text: string;
    section: 'Pasado' | 'Presente' | 'Futuro' | 'Post-Data';
    range: string;
}

export const FULL_POEM: PoemLine[] = [
    // PASADO
    {
        id: 1,
        title: 'Todo empezó en un instante',
        section: 'Pasado',
        range: '1-33',
        text: `Todo empezó en un instante\nDicen que con explosión\nOtros que con un soplido\nAquí nació con YaYá\nEspíritu material y espíritu inmaterial Que colgó sobre su cama una tinaja Con los huesos de su hijo,\nDe ahí salieron los peces\nY toda el agua del mar\nHombres que vivían en cuevas Y temían a Juracán.\nCon el sol se despertaban\nY cuidaban su conuco\nJugaban en los bateyes\nComo hoy, a la pelota\nNo sé si era en día domingo\nPero iban a su areíto\nCaciques, naborías y nitaínos Que dormían sobre una hamaca Se fumaban su tabaco\nCompartían lo que tenían\nEn esta tierra de todos.\nToda cultura en la tierra\nNos habla de ese momento\nEn que todo era armonía\nLos hombres vivían despacio\nLa vida tenía sentido\nY todo lo que existía ocupaba su lugar. Es pasado y es futuro\nGuardado en el subconsciente Un tiempo de paz inmensa\nUtopías que nos alientan\nImposibles de olvidar.`
    },
    {
        id: 34,
        title: 'Del otro lado del mundo',
        section: 'Pasado',
        range: '34-66',
        text: `Del otro lado del mundo Con el permiso del Rey\nY una cruz como bandera Habían salido tres barcos De Palos de la Frontera\nEl destino los guiaba\nDirigidos por Colón,\nLa experiencia de Pinzón Durante 33 días\nAtravesando los mares\nCondujo la expedición.\nY así fue que en una noche, Las 2 de la madrugada\nSe oyó a Rodrigo de Triana Gritando con voz profunda Que tenían tierra a la vista. Llegaron por la mañana\nNos cuenta el mismo Colón Que salió gente desnuda Tierra de árboles muy verdes Muchas aguas, muchas frutas Pero no había cascabeles.\nEllos trajeron la rueda\nEl hierro y los caballos\nCerdos, vacas y gallinas\nLa biblia y el evangelio\nAquí encontraron la papa El tabaco y el maíz\nLa fresa y el chocolate\nLa vainilla y el tomate\nSe llevaron todo el oro\nY nos fundimos en uno\nDando inicio a un nuevo mundo.`
    },
    {
        id: 67,
        title: 'Cuentan que África es',
        section: 'Pasado',
        range: '67-99',
        text: `Cuentan que África es\nMadre de todos los hombres, Que era el sitio del Edén.\nUn grupo de mercenarios\nSe robaban a su gente\nLos traían por estas tierras, En grilletes los forzaban\nA trabajar día y noche\nY fue el último ingrediente Que nos hizo quiénes somos Ni europeos, ni taínos, ni africanos.\nMezclados durante siglos\nFuimos una sola raza\nQue trabajando muy duro\nConstruyo una identidad\nLuchando contra piratas,\nHormigas, filibusteros\nFuimos Francia y luego España Hasta que nuestros vecinos Igual que Napoleón\nNos brindaron libertad\nCon la punta de un cañón.\nEntonces fue cuando Duarte Hombre culto y educado\nRegresó con la visión\nDe Dios, Patria y Libertad.\nConvocó a la Filantrópica\nY con arte entre las manos Fue moviendo corazones\nPrepararon las banderas\nUn grito de tres en tres\nUna noche y un trabuco\nQue fue estrella de Belén.`
    },
    // PRESENTE
    {
        id: 100,
        title: 'El principio del presente',
        section: 'Presente',
        range: '100-132',
        text: `El principio del presente comienza en el siglo XX\nCuando un grupo decidió demarcar todas las tierras\nEn eso andaba un peón que se llamaba Liborio\nSe dice que ese buen hombre fue ascendido a las alturas\nY volvió del más allá mitad Cristo mitad Ché\nSe convirtió en un profeta\nQue sanaba los enfermos y predicaba el amor\nSe enfrentó a los que abusaban defendiendo al campesino, Cuando invadieron la isla tomó arma entre las manos\nLas personas lo escondían, le brindaban alimento\nY en la loma lo mataron convirtiéndolo en un santo.\nEl Tío Sam encomendó de encargado a un general\nQue se llamaba Trujillo\nPadre de la Patria Nueva y autoproclamado dios\nCasi un ser omnipresente que imponía su voluntad\nSembró un reino de terror inigualable\nSe concedía el privilegio de tomar cuanto quería\nObligó a cambiarle el nombre a la ciudad\nHasta que un 30 de mayo hubo un grupo de valientes\nCon agallas suficientes de escalar el monte Olimpo\nLe arrebataron la vida\nRegalándonos por siempre libertad.\nMuy poco tiempo después para ordenar el desorden\nNos enviaron desde el norte otro grupo de marines\nDividieron la ciudad, cercaron a los rebeldes\nCuando en el 65 nuestros hombre y mujeres\nPelearon con militares que eran de aquí y de allá.\nEn ciudad nueva se dice que no fumaban de noche\nPorque un yanqui que tenían en un techo atrincherado\nEra capaz de poner la bala en una luciérnaga,\nAsí se dió la batalla más sangrienta de esta historia\nHubo gente que lloró cuando Caamaño llegó hasta el parque Independencia. Y no valió triunvirato, volvió y volvió Balaguer.`
    },
    {
        id: 133,
        title: 'La era de los ochenta',
        section: 'Presente',
        range: '133-165',
        text: `La era de los ochenta fue una época dorada\nLos domingos en familia se solía ir a cenar\nLa delincuencia era un tema que atacaba otros países Mientras el que había estudiado conseguía un buen trabajo La comida era barata\nY aunque pudiera pecar de parecer muy ingenuo Por lo que dice la frase: “tiempo pasado es mejor” Aún no había sicariato ni bancas en las esquinas Era un tiempo en que el honor era algo de caballeros Se dice que un presidente se nos marcho por honor.\nLos domingos Jack Veneno le aplicaba la polémica A toda la cuadra ruda y hasta al engendro del mal Pololo, Cuquín y Boruga entrevistados por Freddy\nQue se aguantaba la risa y no podía continuar. Las sorpresitas Popeye alegraban a los niños\nLos huevos que se tiraban el día de San Andrés Los helados imperiales, las paletas de Frigor\nNada más emocionante que montar el Super 8 Esperar que den al chavo y después a tres patines En un mundo sobre ruedas que da vueltas sin parar.\nEntonces rápidamente se sucedieron eventos Nos llegó la Perestroika, cayó el muro de Berlín Irak invade Kuwait, la tormenta en el desierto El nacimiento del Grunge, la muerte de Kurt Cobain Liberaron a Mandela y se acabó el apartheid\nClonan la primera oveja y se muere Lady Di\nPerdimos a Freddy Mercury, introducen el cd El papa visita a Cuba, comienzan a vender viagra Microsoft y Macintoch se dividen las ganancias El mundo ha quedado envuelto en la red del internet Y no hubo Y2K.`
    },
    {
        id: 166,
        title: 'Cambio de siglo y milenio',
        section: 'Presente',
        range: '166-198',
        text: `Cambio de siglo y milenio, iniciamos otra historia En este presente actual no existen ideologías\nComunismo, socialismo y democracia, todas valen ya lo mismo Los anuncios de la tele son los únicos filósofos\nSólo debes consumir para adquirir las virtudes\nDel hombre mega-moderno\nUn hombre lleno de cosas y vacio de valores,\nEl esfuerzo necesario para conseguir lo tuyo\nEs un concepto de tontos y la regla que se aplica Es que el dinero es mejor mientras menos trabajado, Que haya pobres ya es costumbre y problema del estado.\nSería fácil compararlo con lo que ocurre en el cuerpo Una máquina brillante que no sabemos usar\nEl hombre mega-moderno no sabe ni respirar\nEstamos ensimismados con la grandeza del hombre No nos entendemos parte de la luna y las estrellas Nos parecemos al cáncer\nCélulas que estando enfermas atacan a las más sanas Se trasladan por el cuerpo hasta producir metástasis Pensamientos cancerígenos que se implantan en la mente Y transforman a la gente en entes depredadores Capaz de vender la patria por un puñado de dólares.\nUna mañana cualquiera llegamos al punto 0\nEl planeta ya agotado nos pedía que nos marcháramos Países morían de hambre, otros quemaban comida Las compañías farmacéuticas en vez de querernos sanos Nos preferían de clientes\nLa política era un juego solo para enriquecerse\nAl hombre no le importaba el hombre que tenia al lado Los carteles y los bancos se hicieron con el poder El concepto de familia hace años transformado\nLa desconexión total, pero todos conectados\nCuando resurgió una raza de nuevos dominicanos.`
    },
    // FUTURO
    {
        id: 199,
        title: 'El futuro de esta historia',
        section: 'Futuro',
        range: '199-231',
        text: `El futuro de esta historia\nnace con una familia\nque para sacar sus hijos\nde tantas complicaciones\ndecide mudarse al campo\nComprendieron que la clave era volver a empezar el tiempo era muy valioso\npara pasarlo sentado\nyendo y viniendo al trabajo\nsin verse más que unas horas,\neso no era calidad.\nSus amigos entendieron\nque ésta era la respuesta\ny se mudaron también\ncrearon nuevas escuelas\ndonde ellos enseñaban\nUna forma creativa de solucionar problemas le mostraban a sus hijos\nque para sobrevivir\ny seguir en este mundo\nLa única meta posible\nes ser autosostenibles.\nPero no eran ermitaños\ntambién tenían internet\ny con paneles solares\ncrearon hogares verdes\nllenos de comodidades\nLas personas de otros pueblos comprendieron el concepto y lucharon por lo mismo\nbuscaron cuales recursos\nproporcionaba la zona\npara poder trabajarlos\nhasta potencializarlos.`
    },
    {
        id: 232,
        title: 'Estas nuevas sociedades',
        section: 'Futuro',
        range: '232-264',
        text: `Estas nuevas sociedades\nempezaron a surgir\na lo largo de la isla\nse trataban como hermanos\nno había problemas de uno\nFinalmente comprendieron que somos parte de un cuerpo Y de estas nuevas ciudades\nsurgió una nueva esperanza\ny estos nuevos sentimientos\ncambiaron nuestra visión\ny el concepto de nación.\nLa isla se organizó\nnuevamente en cacicazgos\nnuestra creatividad\naplicada con esfuerzo\naumentó nuestras riquezas\nLos impuestos se empleaban donde eran necesarios los países en el mundo\nse quedaron boquiabiertos\ncuando acabo la pobreza\ny volvieron las sonrisas\na nuestra tierra bendita.\nNo fue algo complicado\npero requirió de tiempo\nen el planeta completo\npequeñas comunidades\nadaptaron el modelo\nLa nueva revolución no gastó una sola bala\ntodo se hizo libremente\ncada ciudad diferente\ntrabajaron sus recursos\ncompartieron sus ideas\ny empezó una nueva era.`
    },
    {
        id: 265,
        title: 'Si algo hemos de aprender',
        section: 'Futuro',
        range: '265-297',
        text: `Si algo hemos de aprender\nes que la vida es un ciclo\ntodo vuelve a comenzar\nno hay manera de evitarlo\ncada vez sabemos más\nEl momento de iniciar a la vuelta de la esquina sólo debemos confiar\nacabar el pesimismo\nmadre natura no falla\nsiempre elige lo correcto\na la hora de cambiar.\nNuestro mundo volverá\na un tiempo de paz inmensa\ndonde reine la armonía\nel hombre viva tranquilo\nla vida tenga sentido\nDonde todo lo que existe ocupe bien su lugar las familias tendrán tiempo\npara estar unos con otros\nla ciencia terminará\ncon el hambre y la ignorancia\nel mundo será perfecto.\nAunque sólo dure un tiempo\nnada nos cuesta soñar\nque nuestra isla será\nla primada de otra historia\ncomo fuimos una vez\nEl ombligo de este mundo, podemos serlo otra vez. Quisqueyanos. Valientes\nen el mismo trayecto del sol,\nsi alguien quiere saber cuál es mi patria es ella la que anda ya,\nmás arriba, mucho más.`
    },
    // POST-DATA
    {
        id: 298,
        title: 'P.D.',
        section: 'Post-Data',
        range: '298-300',
        text: `Nuestro pasado es hermoso\nNuestro presente es oscuro\nNuestro futuro es ser uno.\nMontezinos\n2013`
    }
];
