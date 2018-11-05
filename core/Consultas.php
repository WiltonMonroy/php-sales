<?php

		session_start();

		require('conectar.php');
		
		$metodo = $_POST["metodo"];
		
		if($metodo == "Inicio")
			return Inicio();
	 
		if($metodo == "Credenciales")
			return ValidarCredenciales();
			
		if($metodo == "CargarIngreso")
			return CargarIngreso();
						
		if($metodo == "AlmacenarFactura")
			return AlmacenarFactura();
			
		if($metodo == "BajaDetalleFactura")
			return BajaDetalleFactura();
		
		if($metodo == "ListarFacturas")
			return ListarFacturas();
			
		if($metodo == "ValidarSesion")
			return ValidarSesion();	
					
			
			
		function ValidarSesion(){
		
			$redirect = 0;
		
			if (!isset($_SESSION['correo']))
				$redirect = 1;
						
			$datos = array(
				'error' => '',
				'redirect' => $redirect
			);
			
			echo json_encode($datos);
		}
		
		
		function Redirect($url, $permanent = false)
		{
			if (headers_sent() === false)
			{
				header('Location: ' . $url, true, ($permanent === true) ? 301 : 302);
			}

			exit();
		}
		
		
		function ValidarCredenciales(){
			
			unset($_SESSION['correo']);
			unset($_SESSION['idUsuario']);
			unset($_SESSION['nombre']);
			
			$registros = 0;
			$correo = $_POST['correo'];
			$clave = $_POST["clave"];
					
			$sql = "select count(*) from 
			usuario where usuario = lower(trim('" . $correo . "')) 
			and clave =  lower(trim('" .  $clave  . "')) and estado = 1";
			
			$conexion = new conectar();
			$valor = $conexion->EjecutarEscalar($sql);
			
			$_SESSION["correo"] = $correo;
						
			if($valor > 0){
			
				$sql = "select id_usuario from usuario where usuario = lower(trim('" . $correo . "')) and clave =  lower(trim('" .  $clave  . "')) and estado = 1";
				$idUsuario = $conexion->EjecutarEscalar($sql);
				
				
				$sql = "select nombre
						from empresa
						where id_usuario = " . $idUsuario;
				$nombre = $conexion->EjecutarEscalar($sql);
				
				$_SESSION["idUsuario"]= $idUsuario;
				$_SESSION["nombre"] = $nombre;
				
				
			}
			
			$datos = array(
				'error' => '',
				'valor' => $valor
			);
			
			echo json_encode($datos);
			
		}
			
				
		function Inicio(){
		
			$redirect = 0;
						
			if (!isset($_SESSION['correo'])) {
				$redirect = 1;
				
				$datos = array(
				'error' => '',
				'redirect' => $redirect,
			);
		
			echo json_encode($datos);
			return;
				
			}
				
			$sqlTexto = "select (ELT(WEEKDAY(Now()) + 1, 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo')) AS DIA_SEMANA";
			$sqlDia ="select day(now())";
			$sqlMes ="select (ELT(month(Now()) , 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre')) AS MES";
			$sqlAnio ="select year(now())";
			
			$conexion = new conectar();
			
			$diaTexto = $conexion->EjecutarEscalar($sqlTexto);
			$dia = $conexion->EjecutarEscalar($sqlDia);
			$mes = $conexion->EjecutarEscalar($sqlMes);
			$anio = $conexion->EjecutarEscalar($sqlAnio);
			
			$datos = array(
				'error' => '',
				'redirect' => $redirect,
				'correo' => $_SESSION["correo"],
				'nombre' => $_SESSION["nombre"],
				'diaTexto' => $diaTexto,
				'dia' => $dia,
				'mes' => $mes,
				'anio' => $anio
			);
		
			echo json_encode($datos);
		}
		
		function CargarIngreso(){
		
			$redirect = 0;
						
			if (!isset($_SESSION['correo'])) {
				$redirect = 1;
				
				$datos = array(
				'items' => "",
				'redirect' => $redirect,
				'correo' => $_SESSION["correo"]
			);
		
			echo json_encode($datos);
			return;
				
				
			}
				
			$sql = "select id_producto, nombre
					from producto
					order by nombre asc";
			
			$conexion = new conectar();
			$registros = $conexion->EjecutarSelect($sql);
			
			$items = '<option value="0">Elija Producto</option>';
			
			foreach ($registros as $dto) {
				$items = $items ."<option value=" .$dto["id_producto"] .">" .$dto["nombre"] . "</option>";
			}
			
			$datos = array(
				'items' => $items,
				'redirect' => $redirect,
				'correo' => $_SESSION["correo"],
				'idUsuario' => $_SESSION["idUsuario"]
				
			);
		
			echo json_encode($datos);
				
		}
		
		
		function AlmacenarFactura(){
		
			$nombre = $_POST["nombre"];
			$dpi = $_POST["dpi"];
			$autorizacion = $_POST["autorizacion"];
			$fecha = $_POST["fecha"];
			$total = $_POST["total"];
			
			$cadenaDetalles = $_POST["cadenaDetalles"];
			$idUsuario = $_POST["idUsuario"];
			
			$redirect = 0;
						
			if (!isset($_SESSION['correo'])) {
				$redirect = 1;
				
				$datos = array(
				'error' => "",
				'redirect' => $redirect
				);
		
				echo json_encode($datos);
				return;
			}
				
			$conexion = new conectar();
			
			$sql = "select count(*) from cliente where dpi = '" .$dpi. "'";
			$valor = $conexion->EjecutarEscalar($sql);
			$idCliente = 0;
			$idFactura = 0;
			
			//cliente
			if($valor == 0) {
				$sql = "insert into cliente(nombre, dpi, estado) values('" .$nombre. "','" .$dpi. "',1)";
				$idCliente = $conexion->EjecutarInsert($sql);
			}
			else{
				$sql = "select id_cliente from cliente where dpi = '" .$dpi. "'";
				$idCliente = $conexion->EjecutarEscalar($sql);
			}
			
			/*
			$sql = "SELECT STR_TO_DATE('" .$fecha. "', '%m/%d/%Y') as FECHA";
			$fechaConvertida = $conexion->EjecutarEscalar($sql);
			*/
			
			//factura
			$sql = "insert into factura (id_cliente, id_usuario, autorizacion, fecha_factura, fecha, total, estado) 
					values(" .$idCliente. "," .$idUsuario. ",'" .$autorizacion. "',  STR_TO_DATE('" .$fecha. "', '%d/%m/%Y') , now(), " .$total. ",1)";
			
			$idFactura = $conexion->EjecutarInsert($sql);
				
			//detalles	
			$arrayDetalles = explode(";" , $cadenaDetalles);
			
			foreach($arrayDetalles as $dto)
			{
				$arrayDatos = explode("," , $dto);
				
				$idProducto = $arrayDatos[0];
				$cantidad = $arrayDatos[1];
				$precio = $arrayDatos[2];
				$subTotal = $arrayDatos[3];
				
				$sql ="insert into detalle_factura (id_factura, id_producto, cantidad, precio, subtotal, estado) 
				values(" .$idFactura. "," .$idProducto. "," .$cantidad. "," .$precio. "," .$subTotal. ",1)";
					
				$conexion->EjecutarInsert($sql);
			}
		
			$datos = array(
				'error' => "",
				'redirect' => $redirect
			);
		
			echo json_encode($datos);
		}
		
		function BajaDetalleFactura(){
			
			$redirect = 0;
			
			if (!isset($_SESSION['correo'])) {
				$redirect = 1;
				
				$datos = array(
				'error' => "",
				'redirect' => $redirect
				);
		
				echo json_encode($datos);
				return;
			}
			
			$idDetalleFactura = $_POST["idDetalleFactura"];
			$sql = "update detalle_factura set estado = 2 where id_detalle_factura =  " .$idDetalleFactura;
			
			$conexion = new conectar();
			$conexion->EjecutarUpdate($sql);
		}
	
		
		function ListarFacturas(){
			
			if (!isset($_SESSION['correo'])) {
				$redirect = 1;
				
				$datos = array(
				'error' => "",
				'redirect' => $redirect
				);
		
				echo json_encode($datos);
				return;
			}
			
			$idUsuario = $_POST["idUsuario"];
			
			$redirect = 0;
			
			
			
			$sql = "select  id_factura, nombre, dpi,  autorizacion, fecha_factura as fecha, total  
					from factura f 
					inner join cliente c on c.id_cliente = f.id_cliente
					where f.id_usuario = " .$idUsuario. " order by id_factura desc ";
				
			
			$conexion = new conectar();
			
			$registros = $conexion->EjecutarSelect($sql);
			
			$datos = array(
				'error' => '',
				'registros' => $registros,
				'redirect' => $redirect,
				'correo' => $_SESSION["correo"]
				
			);
		
			echo json_encode($datos);
		}
		
?>