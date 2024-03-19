## **Sobre este repositório**
Este repositório contém dois projetos relacionados ao uso do React Native Maps e outras bibliotecas para trabalhar com mapas e coordenadas.

**Projeto "Animação"**
O projeto "Animação" apresenta uma animação de um carro percorrendo as ruas. Para implementar essa animação, utilizei a ferramenta de GPS do Android Studio para fazer o carro se movimentar em uma rota pré-definida junto com expo-location.
Este projeto foi inicialmente criado como um exercício de aprendizado para explorar o uso do React Native Maps e outras bibliotecas relacionadas.

## **O projeto principal "Coordenadas"**

Esté uma aplicação móvel desenvolvida em React Native, que oferece recursos de visualização e interação com mapas. 
Com ele, os usuários podem visualizar rotas predefinidas, acompanhar um marcador animado movendo-se ao longo da rota e alternar entre diferentes tipos de mapas. 
Utilizando a API do Google Maps, o aplicativo permite traçar rotas detalhadas com informações de tráfego em tempo real e oferece uma experiência de navegação intuitiva para os usuários.

## Instalação

1. Clone este repositório:
	git clone https://github.com/FellpsH/Projeto-React-Native-api-google
2. Instale as dependências:
	npm install
3. Execute o aplicativo:
	npm start

Isso abrirá o Expo Developer Tools. Você pode então abrir o aplicativo em um emulador ou dispositivo físico.

## Funcionalidades

- Mostra um mapa com um marcador animado seguindo uma rota pré-definida.
- Permite alternar entre diferentes tipos de mapa (padrão e satélite).
- Permite reproduzir o movimento do marcador.
- Mostra a velocidade atual do marcador.
- Permite alterar o idioma do aplicativo.
- Exibe uma mensagem quando o destino é alcançado.

## Tecnologias Utilizadas

- React Native
- react-native-maps
- react-native-maps-directions
- react-native-vector-icons
- react-i18next
- API do Google Maps

## Estrutura de Arquivos

.
├── assets
│ └── vehicles.png
├── components
│ └── Mapa.js
├── languages
│ └── ii8n.js
├── styles
│ └── mapaStyles.js
└── frontend_data_gps.json

## ** DESAFIO **

Animação da Imagem no Sprite: O mapa inclui uma funcionalidade que anima uma imagem de veículo (sprite) de acordo com a direção do carro ao longo da rota:

O código utiliza a função watchPosition(direction) para determinar a direção atual do carro com base nos dados recebidos do GPS. 
Essa função atualiza a variável bussola, que representa a direção em graus na qual o carro está apontando.

A direção é obtida a partir dos dados fornecidos pelo arquivo frontend_data_gps.json. Cada conjunto de dados no arquivo inclui informações sobre a direção do carro. No entanto, em algumas situações, o valor da direção pode ser zero ou não estar definido. Quando isso acontece, o código assume que o carro está apontando para o norte como uma medida padrão

```javascript
const data = require('./frontend_data_gps.json');
            const course = data.courses[selectedCourseIndex];
            const { gps } = course;
            const firstGPS = gps[0];
            const firstCoordinates = {
                latitude: firstGPS.latitude,
                longitude: firstGPS.longitude,
            };
            const seedCarArray = gps.map(coord => ({
                speed: coord.speed,
                direction: coord.direction,
            }));
	...
}

function watchPosition(direction) {
    // Lógica para determinar o ponto cardeal com base na direção
    // e atualizar a variável bússola
    // ...
    setBussola(rosadosventos);
    console.log("direction: " + direction + point + ": " + rosadosventos);
}
```

Atualização da Animação do Sprite:
O componente <Marker.Animated> do React Native Maps é usado para representar o carro no mapa. 
Ele recebe a coordenada atual do carro e usa uma imagem de sprite como ícone.
A propriedade style do <Marker.Animated> é usada para aplicar um estilo à imagem do sprite, 
especificando a posição horizontal do sprite com base na direção do carro (bussola)

```javascript
<Marker.Animated
    coordinate={routeData.coordinates[currentPositionIndex]}
    title="Terceiro Ponto"
    pinColor="blue"
    style={{ width: 100, height: 100 }}
>
    <Image source={spriteImage} style={[styles.sprite, { left: 1 * bussola, width: 1000, height: 1000 }]} />
</Marker.Animated>
```

##Tarefas Bônus:

##Velocidade do Veículo: Utiliza a velocidade real do veículo para determinar a velocidade da animação ao longo do trajeto.

##Obtenção dos Dados de Velocidade: Os dados de velocidade do veículo são extraídos do arquivo frontend_data_gps.json, que contém informações sobre a velocidade em diferentes momentos ao longo do trajeto.
Para determinar a velocidade da animação, o código verifica o valor de speed no arquivo frontend_data_gps.json. Se esse valor for maior que zero, ele é usado. No entanto, caso o arquivo retorne um valor zero, o que pode acontecer, o carro ficará parado. Portanto,   nesse caso, um valor de velocidade aleatório é gerado para simular o movimento do veículo. juste da Velocidade da Animação: A velocidade da animação é ajustada com base na velocidade real do veículo. Quanto maior a velocidade do veículo, mais rápida será a 	animação, e vice-versa. Isso é feito modificando o intervalo entre os frames da animação para refletir a velocidade do veículo.



##Seleção de Trajeto: O código permite que o usuário escolha qual trajeto deseja visualizar no mapa. Isso é feito por meio da função handleCourseSelection(index), onde index representa o índice do trajeto selecionado. Ao pressionar um dos botões correspondentes aos trajetos disponíveis, essa função é chamada, atualizando o estado selectedCourseIndex com o índice do trajeto escolhido. Em seguida, o trajeto selecionado é renderizado no mapa. Abaixo está um trecho de código exemplificando essa funcionalidade:

```javascript
// Função para selecionar um curso
const handleCourseSelection = (index) => {
    setSelectedCourseIndex(index); // Atualiza o estado com o índice do curso selecionado
};
// ...
<View style={styles.courseSelection}>
    {[0, 1, 2, 3, 4].map((index) => (
        <TouchableOpacity
            key={index}
            style={[styles.courseButton, selectedCourseIndex === index ? styles.selectedCourseButton : null]}
            onPress={() => handleCourseSelection(index)}
        >
            <Text style={styles.courseButtonText}>{t('common.course')}  {index + 1}</Text>
        </TouchableOpacity>
    ))}
</View>
```

##Observação: É importante notar que a animação do carro pode não ser perfeita em todos os momentos, pois a direção do carro é obtida a partir dos dados fornecidos pelo arquivo frontend_data_gps.json. Em algumas situações, esse arquivo pode fornecer um valor de direção zerado, fazendo com que o carro permaneça apontado para o norte. Isso pode resultar em uma animação menos precisa da direção do veículo ao longo do trajeto.

##Complemento: Na pasta "animação", a animação é aprimorada com o uso da biblioteca Expo Location, que captura dados de GPS do telefone para proporcionar uma animação mais precisa. Nesse contexto, os dados obtidos diretamente do GPS do dispositivo garantem uma animação mais fiel à direção real do veículo. Recomenda-se acessar essa pasta para visualizar como a animação foi implementada e como ficou o resultado final.Eu não usei o expo-location no projeto, pois o objetivo era usar os os dados de frontend_data_gps.json.

##Link para um video de mostração do projeto no YouTube: https://youtu.be/8ghdyjc-drE

