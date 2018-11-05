$(document).ready(function () {

	Limpiar();
	
	$("#btnIngresar").click(function (e) {
		Ingresar();
		return false;
    });
	
	$("#btnLimpiar").click(function (e) {
        Limpiar();
		return false;
    });
	
	
	 $("#email").keydown(function (e) {
        
		$("#spAlerta").text("");
		
		tecla = (document.all) ? e.keyCode : e.which;
        
		if (tecla == 13) {
            Ingresar();
            return false;
        }
		
		
    });
	
	$("#password").keydown(function (e) {
        
		$("#spAlerta").text("");
		
		tecla = (document.all) ? e.keyCode : e.which;
        
		if (tecla == 13) {
            Ingresar();
            return false;
        }
		
		
		
    });
	
   
});

function Limpiar() {

    $("#email").val("");
	$("#password").val("");
}

function Ingresar(){
	
	var correo = $("#email").val().trim();
	var clave =  $("#password").val().trim();
	
	if(correo == ""){
		$("#spAlerta").text("Ingrese Correo Electrónico");
		return;
	}
	
	if(!validarEmail(correo)){
		$("#spAlerta").text("Ingrese Correo Válido");
		return;
	}
	
	
	if(clave == ""){
		$("#spAlerta").text("Ingrese Contraseña");
		return;
		
	}
		
	var valor = -1;
	
	$.ajax({
        async: true,
        type: "POST",
		dataType: "json",
		url: "./core/Consultas.php",
        data: {
			metodo:"Credenciales",
			correo: correo,
			clave: clave
        },
        success: function (result) {

			if( result.valor == 1){
				window.location.href = "inicio.html";
			}
			else{
				$("#spAlerta").text("Credenciales Incorrectas, Intente de nuevo por favor");
			}
				
        },
        error: function (errMsg) {
            alert(errMsg.responseText);
        }
    });
		
}


function validarEmail(valor) {
  if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)){
   return true;
  } 
   
   return false;
}


