var detalleProductos = [];

$(document).ready(function () {
	
	//$("#txtFecha").inputmask({ mask: "99/99/9999"});
	$("#spTotal").text("0.00");
	
	CargarIngreso();
	
	$("#btnLimpiarEncabezado").click(function (e) {
		LimpiarEncabezado();
		return false;
    });
	
	
	$("#btnLimpiarDetalle").click(function (e) {
		LimpiarDetalle();
		return false;
    });
	
	
	$("#btnAgregar").click(function (e) {
		AgregarDetalle();
		return false;
    });
	
	$("#btnAlmacenar").click(function (e) {
		AlmacenarFactura();
		return false;
    });
	   
});



function CargarIngreso(){
	
	$.ajax({
        //async: true,
        type: "POST",
		dataType: "json",
		url: "./core/Consultas.php",
        data: {
			metodo:"CargarIngreso"
			
        },
        success: function (result) {
					
			if(result.redirect == 1)
				window.location.href = "index.html";
		
			$("#spNombre").text(result.correo);
			$("#dllProducto").html(result.items);
			$("#hfIdUsuario").val(result.idUsuario);
						
		},
        error: function (errMsg) {
            alert(errMsg.responseText);
        }
    });
		
}


function LimpiarEncabezado(){

	$("#txtIdentificacion").val("");
	$("#txtDPI").val("");
	$("#txtAutorizacion").val("");
	$("#txtFecha").val("");

}


function LimpiarDetalle(){

	$("#dllProducto").val(0);
	$("#txtPrecio").val("");
	$("#txtCantidad").val("");
	
}


function ValidarSoloNumeros(e) {

	var teclaPresionada = (document.all) ? e.keyCode : e.which;

    if (TeclasEspeciales(e))
        return true;

    patron = /\d/;
    caracter = String.fromCharCode(teclaPresionada);
	
	return patron.test(caracter);
	
}


function TeclasEspeciales(e) {
    //8= BackSpace, 9=Tab, 37 = flecha izquierda, 39 = flecha derecha, 46 = Delete (Supr) , 32 = barra espaciadora
    teclasEspeciales = [8, 9, 37, 39, 46, 32];
    for (var i in teclasEspeciales) {
        if (e.keyCode == teclasEspeciales[i] && e.charCode == 0)
            return true;
    }
    return false;
}


var jsonDetalle = {items: []};

function AgregarDetalle(){

	var idProducto = $("#dllProducto").val();
	var nombre = $( "#dllProducto option:selected" ).text();
	var precio = $("#txtPrecio").val().trim();
	var cantidad = $("#txtCantidad").val().trim();
	
	if(idProducto == 0){
		MostrarVentana("Seleccione Producto");
		return;
	}
	
	if(precio == ""){
		MostrarVentana("Ingrese Precio");
		return;
	}
	
	if(isNaN(precio)){
		MostrarVentana("Ingrese valor numérico en Precio");
		return;
	}
	
	
	if(cantidad == ""){
		MostrarVentana("Ingrese Cantidad");
		return;
	}
	
	if(isNaN(cantidad)){
		MostrarVentana("Ingrese valor numérico en Cantidad");
		return;
	}
	
	
	if(!isInteger(cantidad)){
		MostrarVentana("Ingrese valores enteros en Cantidad");
		return;
	}
	
	
	for (var i = 0; i <= detalleProductos.length - 1; i++){
	
		if(idProducto == detalleProductos[i].idProducto){
		
			MostrarVentana("El producto " + detalleProductos[i].nombre + " ya se encuentra en el detalle");
			return;
		}
	}
	
	
	var subtotal = precio * cantidad;
	
	var precioPlacedFloat = parseFloat(precio).toFixed(2);
	var subtotalPlacedFloat = parseFloat(subtotal).toFixed(2);
	
	var detalle = {index: index, idProducto: idProducto, nombre: nombre, precio:precioPlacedFloat, cantidad: parseInt(cantidad), subtotal: subtotalPlacedFloat};
	detalleProductos.push(detalle);
	jsonDetalle.items.push(detalle);
	
	var dataDetalle = [];
	
    for (var i = 0; i <= detalleProductos.length - 1; i++){
	
		var index = i + 1;
        dataDetalle.push({index: index, rowIndex:i, idProducto: detalleProductos[i].idProducto, nombre: detalleProductos[i].nombre, precio:detalleProductos[i].precio, cantidad:detalleProductos[i].cantidad, subtotal: detalleProductos[i].subtotal});
	}
		
	CargarTablaDetalles(dataDetalle);
	LimpiarDetalle();
	
	var actual = $("#hfTotal").val() == "" ? 0 : parseFloat($("#hfTotal").val());
	var total = actual + subtotal;
	
	var totalParsed = parseFloat(total).toFixed(2);
	
	$("#hfTotal").val(total);
	$("#spTotal").text(totalParsed);
	Botones();
}


function isInteger(x) {
  var integer = parseInt(x, 10);
  if (!isNaN(integer) && !isFloat(x)) {
    return true;
  }
  return false;
}

function isFloat(x) {
  var f = parseFloat(x);
  var floor = Math.floor(f);
  var fraction = f - floor;
  if (fraction > 0) {
    return true;
  }
  return false;
}


function CargarTablaDetalles(dataset) {

    var t = $('#tbDetalles').dataTable({
        data: dataset,
        bLengthChange: false,
        ordering: false,
        destroy: true,
        bPaginate: false,
        bFilter: false,
        //bServerSide: false,
        //searching: false,
        autoWidth: true,
        info: false,
        aoColumns: [
                        { mData: "index" },
						{ mData: "nombre" },
						{ mData: "precio" },
						{ mData: "cantidad" },
						{ mData: "subtotal" },
                        {
                            mData: "index", width: "auto",
                            ClassName: "body-center",
                            render: function (id_campo, type, full, meta) {
                                //return "<a href='javascript:EliminarDetalle(" + full.rowIndex + ")'class='btn btn-info btn-md'><span class='fa  fa-trash-o'></span>Eliminar</a>";
								return '<a href="javascript:EliminarDetalle(' + full.rowIndex + ');" class="btn btn-primary btn-md" style="display:' + '" title="Eliminar"><span class="glyphicon glyphicon-trash"></span></a>';
							}
                        },
                    ],
        language: {
            sProcessing: "Procesando...",
            sLoadingRecords: "Cargando...",
            sInfoFiltered: "(filtrando un total de _MAX_ registros)",
            lengthMenu: "Se muestran _MENU_ registros por página",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            info: "Mostrando página _PAGE_ de _PAGES_",
            infoEmpty: "No hay registros disponibles",
            search: "Búsqueda",
            paginate: {
                sFirst: "Primero",
                sLast: "Último",
                previous: "Anterior",
                next: "Siguiente"
            },
            infoFiltered: "(filtered from _MAX_ total records)"
        }

    });
	
}


function EliminarDetalle(rowIndex) {
	
	var subtotal = detalleProductos[rowIndex].subtotal;
	detalleProductos.splice(rowIndex,1);
	
	var dataDetalle = [];
	 for (var i = 0; i <= detalleProductos.length - 1; i++){
	
		var index = i + 1;
        dataDetalle.push({index: index, rowIndex:i, idProducto: detalleProductos[i].idProducto, nombre: detalleProductos[i].nombre, precio:detalleProductos[i].precio, cantidad:detalleProductos[i].cantidad, subtotal: detalleProductos[i].subtotal});
	}
	
	CargarTablaDetalles(dataDetalle);
	
	var actual = $("#hfTotal").val() == "" ? 0 : parseFloat($("#hfTotal").val());
	var total = actual - subtotal;
	
	var totalParsed = parseFloat(total).toFixed(2);
	
	$("#hfTotal").val(total);
	$("#spTotal").text(totalParsed);
	Botones();
	
	//jsonDetalle.items.splice(rowIndex,1);
	//var kIndex = 1;
	/*
	for (var clave in jsonDetalle.items){
		var detalle = jsonDetalle.items[clave];
		dataDetalle.push({index: kIndex, idProducto: detalle.idProducto, nombre: detalle.nombre, precio:detalle.precio, cantidad:detalle.cantidad, subtotal: detalle.subtotal});
	}
	*/
}

function MostrarVentana(texto) {

	$("#spTexto").text(texto);
	$("#spTitulo").html("Nuevo");
	$('#myModal').modal('show');
}


function Botones(){

	$("#btnAlmacenar").addClass("btn btn-primary btn-block btn-flat disabled");
	$("#btnPdf").addClass("btn btn-danger btn-block btn-flat disabled");
	
	var actual = $("#hfTotal").val() == "" ? 0 : parseFloat($("#hfTotal").val());
		
	if(actual > 0){
		$("#btnAlmacenar").removeClass("btn btn-primary btn-block btn-flat disabled").addClass("btn btn-primary btn-block btn-flat");
		$("#btnPdf").removeClass("btn btn-danger btn-block btn-flat disabled").addClass("btn btn-danger btn-block btn-flat");
	}
	
}


function EsFechaValida(fecha) {
	if (fecha == undefined || fecha == "") { return true; }

	if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) { return false; }

	var dia = parseInt(fecha.substring(0, 2), 10);
	var mes = parseInt(fecha.substring(3, 5), 10);
	var anio = parseInt(fecha.substring(6), 10);

	switch (mes) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			numDias = 31;
			break;
		case 4: case 6: case 9: case 11:
			numDias = 30;
			break;
		case 2:
			if (EsAnioBisiesto(anio)) { numDias = 29 } else { numDias = 28 };
			break;
		default:
		return false;
	}

	if (dia > numDias || dia == 0) { return false; }

	return true;
}

function EsAnioBisiesto(anio) {
	if ((anio % 100 != 0) && ((anio % 4 == 0) || (anio % 400 == 0))){ return true; }
	else { return false; }
}

function ValidarNumerosDecimales(e) {
    teclaPresionada = (document.all) ? e.keyCode : e.which;
    if (TeclasEspeciales(e))
        return true;
    patron = /^\d*\.?\d*$/;
    caracter = String.fromCharCode(teclaPresionada);
    return patron.test(caracter);
} 


function MascaraFecha(element, e) {
    if (element.value == '__/__/____') element.value = '';

    var tecla = (document.all) ? e.keyCode : e.which;

    if (TeclasEspeciales(e)) return true;

    var patron = /\d/;
    var caracter = String.fromCharCode(tecla);
    var ancho = element.value.length;
    if (ancho == 2 || ancho == 5)
        element.value += '/';
    if (ancho == 9) {
        
		var fecha = element.value + caracter;
        
		if (!EsFechaValida(fecha))
            MostrarVentana("La fecha ingresada no es válida, por favor compruebe.");
    }

    return patron.test(caracter);
} 



function ValidarFecha() {

    var fecha = $("#txtFecha").val();

    //quita los caracteres de más
    if (fecha.length > 10) {
        fecha = fecha.substring(0, 10);
        $("#txtFecha").val(fecha);
    }
  
  /*
    var patron = /\d{1,2}\/\d{1,2}\/\d{4}/;
    if (!patron.test(fecha)) {
        MostrarVentana('La fcecha ingresda no tiene el formato válido.');
        return false;
    }
	*/
	
	var arrayFecha = fecha.split('/');
	var dia = arrayFecha[0];
	var mes = arrayFecha[1];
	var anio = arrayFecha[2];
	
	var nuevaFecha = mes + "-" + dia +"-" + anio;
	
	if(!isValidDate(nuevaFecha)){
		MostrarVentana('La fecha ingresada no es válida2.');
        return false;
	}

    return true;
}


function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}


function AlmacenarFactura(){

	var actual = $("#hfTotal").val() == "" ? 0 : parseFloat($("#hfTotal").val());
	
	if(actual == 0)
		return;
		
	var nombre = $("#txtIdentificacion").val().trim();
	var dpi = $("#txtDPI").val().trim();
	var autorizacion = $("#txtAutorizacion").val().trim();
	var fecha = $("#txtFecha").val().trim();
	var idUsuario = $("#hfIdUsuario").val();
	var total = $("#hfTotal").val();
	
	if(nombre == ""){
		MostrarVentana("Ingrese Nombre");
		return;
	}
	
	if(dpi == ""){
		MostrarVentana("Ingrese DPI");
		return;
	}
	
	if(isNaN(dpi)){
		MostrarVentana("Ingrese valor numérico en DPI");
		return;
	}
	
	if(!isInteger(dpi) || dpi.length < 13){
		MostrarVentana("Ingrese formato correcto de 13 dígitos en DPI");
		return;
	}
	
	if(autorizacion == ""){
		MostrarVentana("Ingrese Autorización");
		return;
	}
	
	if(fecha == ""){
		MostrarVentana("Ingrese Fecha");
		return;
	}
		
	if (!EsFechaValida(fecha)){
		MostrarVentana("La fecha ingresada no es válida, por favor compruebe.");
		return;
	}
			
	var cadenaDetalles = "";

	for (var i = 0; i <= detalleProductos.length - 1; i++){
		
		if(cadenaDetalles != "")
			cadenaDetalles += ";";
		
		var arrayRegistro = [detalleProductos[i].idProducto, detalleProductos[i].precio, detalleProductos[i].cantidad, detalleProductos[i].subtotal];
		cadenaDetalles += arrayRegistro.join();
	}	
	
		
	$.ajax({
        //async: true,
        type: "POST",
		dataType: "json",
		url: "./core/Consultas.php",
        data: {
			metodo:"AlmacenarFactura",
			nombre: nombre.toUpperCase(),
			dpi: "*" + dpi,
			autorizacion: autorizacion.toUpperCase(),
			fecha: fecha,
			total: total,
			idUsuario: idUsuario,
			cadenaDetalles: cadenaDetalles
        },
        success: function (result) {
					
			if(result.redirect == 1)
				window.location.href = "index.html";
				
			if(result.error != ""){
				MostrarVentana(error);
				return;
			}
			
			window.location.href = "ingreso.html";			
			
		},
        error: function (errMsg) {
            alert(errMsg.responseText);
        }
    });	
	
	/*
	
	if(error != ""){
		MostrarVentana(error);
		return;
	}
	
	LimpiarDetalle();
	LimpiarEncabezado();
	$("#divTabla").hide();
	*/
	
}




  





