var cartasClone1 = new Array(); // Array que irá pegar uma certa quantidade do conjunto
var cartasClone2 = new Array(); // Nesse array ele será um 'clone' das cartas pegas
var cartasJogadas = new Array();// Fusão de ambas que formará os pares aparecer no jogo
var i;
var random;
var carta1;
var carta2;
var idCarta1; //Identificação da primeira carta virada para comparar
var idCarta2; //Identificação da segunda carta virada
var p2 = false; //Modo de 2 jogadores desabilitado
var vez = 1; //1 para o jogador 1 e 2 para o jogador 2

//Tempo Limite no modo Solo
function tempoLimite(tempo)
{
    var min = tempo;
    var seg = 0;
    document.getElementById("yuyuyu").innerHTML = min +":" + seg + 0;

    /**setInterval() é uma função do JS onde ele executa uma função em um intervalo de tempo
     * o parametro carregará (função,os milisegundos)
     * para encerrar o loop da função use o clearInterval()
     * Aqui eu fiz uma função de tempo limite para vencer o jogo
    */
    var myTimer = setInterval(timer,1000);
    function timer()
    {
        if(seg == 0)
        {
            min--;
            seg = 59;
        }
        //Quando estiver preste a acabar o tempo ficará em vermelho
        if(min == 0 && seg <= 10)
        {
            $(".timer").css({"color":"red"});
        }

        seg--;
        document.getElementById("yuyuyu").innerHTML =  min +":" + seg;
        
        if(min == 0 && seg == 0)
        {
            alert("Acabou o Tempo Você Perdeu");
            clearInterval(myTimer);
            retirarClick();
        }

    }
}

/* Aqui será atribuida as cartas do jogo*/
function prepararCartas(qt)
{	
    $("#modos").remove();
    var str = "";

    /**
    * O Math.floor ele arredonda para baixo ou seja 2,5 vai se tornar 2
    * O Math.round ele arredonda para o mais perto podendo ser tanto pra cima como pra baixo
    * Aqui o Math.round podia estar arredondando 7,5 para 8 assim dando pau e não encontrando a imagem
    * da carta(epoca que testei com 7 cartas no inicio).
    */

    /** 
    * random() sera uma posição aleatória do array que contem todas as cartas
    * Através do push ele irá acrescentar uma carta aleatória do conjunto total(array cartas[]) no cartasClone1
    * Para evitar que as cartas sejam clonadas mais de duas vezes,vamos retirar o array pego do conjunto
    * original (cartas).
    * O .splice serve para adicionar ou remover um elemento do array
    */ 
    for(i = 0;i < qt; i++)
    {
        random = Math.floor(Math.random() * cartas.length);
        cartasClone1.push( cartas[random] );
        cartas.splice(random,1);
    }

    //Duplicando as cartas atribuidas ao jogo formando os pares
    //O .slice irá extrair/copiar do array (cartasClone1) começando a partir do index 0
    cartasClone2 = cartasClone1.slice(0);

    //Juntando ambos os arrays formando assim os pares de cartas
    cartasJogadas = cartasClone2.concat(cartasClone1);

    //Embaralhando as cartas (as posições do array)
    cartasJogadas.sort(function(a,b){return 0.5 - Math.random()});
}

/* Inicio do jogo modo solo
 * Nesses parâmetros serão colocados o tempo limite e a quantidade de cartas
 * que definirão a dificuldade
*/
function start(tempo, qt)
{	
    prepararCartas(qt);
    tempoLimite(tempo);
    var str = "";

    //Caso as cartas sejam demais para a tela,diminuir a coluna para caber elas
    if(cartasJogadas.length == 36)
    {
        document.getElementById("conjunto").classList.remove("col-md-8");
        document.getElementById("conjunto").classList.add("col-md-12");
    }

    //Exibindo as cartas no HTML
    for(var i2 = 0;i2 < cartasJogadas.length;i2++ )
    {
        str += "<div align=\"center\"class=\"cartas\" id=\"divCard"+ i2 +"\" onclick=\"escolherCarta("+i2+");\"><img src=img/GuessWho.jpg class=\"card\" id=\"imgCard"+ i2 +"\"><\/div>";
    }
    document.getElementById("conjunto").innerHTML = str;
}

// Inicio do jogo de dois players
function startDoisJogadores()
{
    $(".jogadores").css({"display":"inline-block"});
    document.getElementById("vez").innerHTML = "Agora é a vez do Jogador "+ vez;
    $("#jogador1").css({"background-color":"rgba(0,250,154,50%)"});
    prepararCartas(12);
    var str = "";
    $("#conjunto").css({"width":"1px"});
    //$("#conjunto").css({"margin-left":"250px"});

    //Exibindo as cartas
    for(var i2 = 0;i2 < cartasJogadas.length;i2++ )
    {
        str += "<div align=\"center\"class=\"cartas\" id=\"divCard"+ i2 +"\" onclick=\"escolherCarta("+i2+");\"><img src=img/GuessWho.jpg class=\"card\" id=\"imgCard"+ i2 +"\"><\/div>";
    }
    document.getElementById("conjunto").innerHTML = str;
    p2 = true;
}	

// Função para retirar o click de todos as cartas 
// para que o jogador não consiga selecionar 3 cartas rapidamente
function retirarClick()
{
    for (i=0; i < cartasJogadas.length;i++)
    {
        //pointer-events é uma função do css em que ele desabilita as ações do ponteiro no elemento
        $('#divCard'+i).css({'pointer-events':'none'});
    }
}

//Essa função será devolverá o click as cartas como era antes
function devolverClick()
{
    for (i = 0;i < cartasJogadas.length;i++)
    {
        //o auto restaura o click
        $('#divCard'+i).css({'pointer-events':'auto'});
    }
}

function desvirarCartas()
{
    carta1 = null;
    carta2 = null;

    //Virando as cartas novamente no caso de estarem erradas
    document.getElementById("imgCard"+idCarta1).classList.remove("flip");
    $("#imgCard"+idCarta1).attr('src','img/GuessWho.jpg');
    document.getElementById("imgCard"+idCarta2).classList.remove("flip");
    $("#imgCard"+idCarta2).attr('src','img/GuessWho.jpg');

    //Devolvendo o atributo onclick para a Carta 1 do jeito que estava,com Javascript puro
    document.getElementById("divCard"+idCarta1).setAttribute("onclick",
    "escolherCarta("+ idCarta1 +");");

    //Devolvendo o atributo onclick para a Carta 2 do jeito que estava,com Jquery
    $("#divCard"+idCarta2).attr("onclick","escolherCarta("+ idCarta2 +");");
}


function escolherCarta(pos)
{
        //Caso a pessoa não tenha virado a primeira carta ainda
        if(carta1 == null)
        {
            idCarta1 = pos;
            carta1 = cartasJogadas[pos];

            //classList.add() adiciona uma class ao elemento
            //Essa classe flip ela faz a animação de virar a carta
            document.getElementById("imgCard"+pos).classList.add("flip");

            //Dando um tempo para ao virar a carta a imagem mudar
            setTimeout(() => {
                document.getElementById("imgCard"+pos).src = "img/" + carta1 + ".png"; 
              }, 260);

            //Impedindo que a função seja acionada novamente na carta escolhida
            document.getElementById("divCard"+pos).removeAttribute("onclick");
            return;
        }
        
        idCarta2 = pos;
        carta2 = cartasJogadas[pos];
        document.getElementById("imgCard"+pos).classList.add("flip");
        setTimeout(() => {
            document.getElementById("imgCard"+pos).src = "img/" + carta2 + ".png"; 
          },300);
        document.getElementById("divCard"+pos).removeAttribute("onclick");
        retirarClick();
        switch(p2)
        {
            case false: setTimeout(verificaAcerto,1100); break
            case true: setTimeout(verificaAcerto2,1100);break
            default: alert("ERROR");
        }			
}

function verificaAcerto()
{
    //Se as duas cartas estiverem viradas...
    if(carta1 != null && carta2 != null)
    {
        //Caso as cartas sejam iguais
        if(carta1 == carta2)
        {
            //O par de cartas certas não terão mais função nenhuma.
            //Removendo o atributo onclick da 1ª carta com Javascript puro
            document.getElementById("divCard"+idCarta1).removeAttribute("onclick");
            //Removendo o atributo onclick da 2ª carta com Jquery
            $("#divCard"+idCarta2).removeAttr("onclick");
            carta1 = null;
            carta2 = null;
        }

        //Caso elas não sejam iguais
        else
        {
            desvirarCartas()
        }
        devolverClick();
    }
}

//2 Jogadores----------------------------
function verificaAcerto2()
{
    //Se as duas cartas estiverem viradas...
    if(carta1 != null && carta2 != null)
    {
        //Caso as cartas sejam iguais
        if(carta1 == carta2)
        {
            /**
            * Removendo a função onclick com javascript e Jquery
            */
            document.getElementById("divCard"+idCarta1).removeAttribute("onclick");
            $("#divCard"+idCarta2).removeAttr("onclick");

            /**
            * As cartas certas sairão do tabuleiro
            * Elas terão sua opacidade zerada pois se remover as div's delas afetara
            * a posição das outras cartas
            */
            $("#divCard"+idCarta1).css({"opacity":"0"});
            $("#divCard"+idCarta2).css({"opacity":"0"});

            // Os pares de cartas certas irão para a coluna do jogador que as tirou
            if(vez == 1)
            {	
                $("#jogador1").append("<br><img src=\"img/"+carta1+".png\" class=\"smallImg\">");
                $("#jogador1").append("<img src=\"img/"+carta2+".png\" class=\"smallImg\">");	
            }
            else if (vez == 2)
            {
                $("#jogador2").append("<br><img src=\"img/"+carta1+".png\" class=\"smallImg\">");
                $("#jogador2").append("<img src=\"img/"+carta2+".png\" class=\"smallImg\">");
            }
            carta1 = null;
            carta2 = null;
        }
        else
        {	
            if(vez == 1)
            {
                document.getElementById("vez").innerHTML = "Agora é a vez do Jogador 2";
                $("#jogador1").css({"background-color":"white"});
                $("#jogador2").css({"background-color":"rgba(0,250,154,50%)"});
                vez = 2;
            }
            else if(vez == 2)
            {
                $("#jogador1").css({"background-color":"rgba(0,250,154,50%)"});
                $("#jogador2").css({"background-color":"white"});
                document.getElementById("vez").innerHTML = "Agora é a vez do Jogador 1";
                vez = 1;
            }
            desvirarCartas();
        }
        devolverClick();
    }
}
