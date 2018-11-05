$(document).ready(function () {

	CargarDatos();
   
});


function CargarDatos(){

	$.ajax({
        async: true,
        type: "POST",
		dataType: "json",
		url: "./core/Consultas.php",
        data: {
			metodo:"Inicio"
			
        },
        success: function (result) {
					
			if(result.redirect == 1)
				return window.location.href = "index.html";
		
			$("#spNombre").text(result.correo);
		
			$("#spBienvenido").text("Bienvenido " + result.nombre + ", "+ result.diaTexto + " " + result.dia + " de " + result.mes + " del " + result.anio );
		},
        error: function (errMsg) {
            alert(errMsg.responseText);
        }
    });


}

