;
var parallax_Box;
var parallax_Layer0;
var parallax_Layer0Inf = {mp:0,sc:1};
var parallax_layers = [];
var parallax_layers_d = [];

function parallax_initSVGContainer (id,src,w,h)
{
	var namespacesvg = "http://www.w3.org/2000/svg";
	var svg;
	// verifica suporte à SVG, se não tiver com certeza é IE
	if(document.createElementNS)
	{
		try
		{
			svg = document.createElement("iframe");
			svg.className = "parallaxLayers";
			svg.setAttribute("id", id);
			$(svg).css("width",w.toString()+"px").css("height",h.toString()+"px");
			svg.src = src;
			parallax_Box.appendChild(svg);
			return $(svg);
		} catch (e) {/*alert(e.message);*/};
	}
	return null;
}

function parallax_initSWFContainer (id,src,w,h)
{
}

function parallax_initIMGContainer (id,src,w,h)
{
	var img = document.createElement("img");
	img.className = "parallaxLayers";
	img.setAttribute("id", id);
	$(img).css("width",w.toString()+"px").css("height",h.toString()+"px");
	img.setAttribute("src",src);
	parallax_Box.appendChild(img);
	return $(img);
}

function parallax_setBackground (src, maxPixels, scale)
{
	parallax_Layer0.css("background","url('" + src + "')");
	parallax_Layer0Inf = {mp:maxPixels, sc:(1/scale)};
}

// TODO: Refinar o código para melhor performance
function parallax_top(ph,s,sc,x)
{
	s = 1/s;
	return parseInt(ph*x*s + ph*sc*s);
}

function parallax_bottom(ph,s,sc,ob)
{
	s = 1/s;
    var x = ph - ob.height()/ph;
	return -parseInt(x*s + ph*sc*s);
}

function parallax_addLayer(ob, scale, x, y)
{
	var _y = 0;
	if (y<1 && y>=0) // medida em proporção
		_y = y;
	else
		_y = y / ($(document).height() - $(window).height());
	parallax_layers.push({ob:ob, sc:scale,x:x,y:_y});
}

function parallax_addBottomLayer(ob, scale, x)
{
	parallax_layers_d.push({ob:ob, sc:scale,x:x,y:0});
}

function parallax_size(e)
{
	var w = Math.floor($(window).width() / 2);
	for( var l in parallax_layers)
	{
		var ly = parallax_layers[l];
		ly.ob.css("left", String(w+ly.x) + "px");
	}
}

function parallax_run(e)
{
	var wh = $(window).height();
	var ph = $(document).height() - wh;
	var scT = $(document).scrollTop();
	var mSc = -scT / ph;

	parallax_Layer0.css("background-position","center "+parseInt(parallax_Layer0Inf.mp*mSc*parallax_Layer0Inf.sc).toString()+"px");
	
    var ly;
    // layers de cima
	for( var l in parallax_layers)
	{
		ly = parallax_layers[l];
		ly.ob.css("top", parallax_top(ph,ly.sc,mSc,ly.y).toString() + "px");
	}
    // layers restritos ao final da página
    for( var l in parallax_layers_d)
    {
		ly = parallax_layers_d[l];
        ly.ob.css("bottom", parallax_bottom(ph,ly.sc,mSc,ly.ob).toString() + "px");
	}
}

/**
* Inicializa o widget parallax
**/
function parallax_init()
{
	//Nucleo do widget (não mecha)
	parallax_Box = document.createElement("div");
	parallax_Box.id = "parallaxContainer";
	document.body.insertBefore(parallax_Box, document.body.firstChild);

	parallax_Layer0 = $(parallax_Box);
	
	parallax_custom_init();
	
	//Ajustes finais
	$(window).scroll(parallax_run);
	$(window).resize(parallax_size);
	parallax_size(null);
	parallax_run(null);
}


$("document").ready(parallax_init);
