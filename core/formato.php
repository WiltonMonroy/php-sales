
<?php
		
		require('conectar.php');
		
		
		$idFactura = $_POST["idFactura"];
		
		$sql =	"select  d.id_factura, p.nombre, d.cantidad, d.precio, d.subtotal 
				from detalle_factura d
				inner join producto p on p.id_producto = d.id_producto
				where d.id_factura = " .$idFactura; 
		
		$conexion = new conectar();
		$detalleFactura = $conexion->EjecutarSelect($sql);
		
		$detalles = "";
		$i = 1;
		
		foreach($detalleFactura as $dto)
		{
			$registro = "<tr>
						  <td>" .$i. "</td>
						  <td>" .$dto['nombre'].  "</td>
						  <td>" .$dto['cantidad'].   "</td>
						  <td>" .$dto['precio']. "</td>
						  <td>" .$dto['subtotal'].  "</td>
						</tr>";
				
			$detalles =  $detalles . $registro;
			$i++;
		}
		
		$sql = "select  id_factura, nombre, dpi,  autorizacion, fecha_factura, total  
					from factura f 
					inner join cliente C on C.id_cliente = f.id_cliente
					where f.id_factura = " .$idFactura;
		
		$encabezado = $conexion->EjecutarSelect($sql);
		
		$fecha = $encabezado[0]['fecha_factura'];
		$nombre = $encabezado[0]['nombre'];
		$dpi = $encabezado[0]['dpi'];
		$autorizacion = $encabezado[0]['autorizacion'];
		$total = $encabezado[0]['total'];
		$barra = urlencode ("id:".$idFactura."-total:".$total); 
		
		
		$html = '<!DOCTYPE html>
		<html lang="en">

			<head>
			  <title></title>
			  <meta charset="utf-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1">
				
				<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->
				<!--<link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">-->
				<!--<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>-->
				
				<link rel="stylesheet" href="css/bootstrap/dist/css/bootstrap.min.css">
				<link rel="stylesheet" href="css/dataTables.bootstrap.min.css">
				
				
			</head>
				
			<body>

		<section class="invoice" style="width:70%; margin-left:15%"  >
			  <!-- title row -->
			  <div class="row">
				<div class="col-xs-12">
				  <h2 class="page-header">
					<i class="fa fa-globe"></i> Orden # '.$idFactura. 
					'</h2>
				</div>
				<!-- /.col -->
			  </div>
		</section>
			  
				
			  
		<section class="invoice" style="width:70%; margin-left:15%"  >
			  <div class="row">
				<div class="col-lg-1">
				 FECHA: <strong>'.$fecha.'</strong> 
				</div>
				<div class="col-lg-1" >
				 NOMBRE: <strong>'.$nombre.'</strong>
				</div>
				<div class="col-6">
				 DPI: <strong>'.$dpi.'</strong>
				</div>
				<div class="col-6">
				 AUTORIZACIÓN: <strong>'.$autorizacion.'</strong>
				</div>
			 </div>
		</section>
			  
			<br/>
			  <!-- Table row -->
			  <div class="row">
				<div class="col-xs-12 table-responsive">
				  <table class="table table-striped">
					<thead>
					<tr>
					  <th>#</th>
					  <th>Producto</th>
					  <th>Precio</th>
					  <th>Cantidad</th>
					  <th>Total Despachado</th>
					</tr>
					</thead>
					<tbody>'.$detalles.'</tbody>
				  </table>
				</div>
			  </div>
			
			  <div class="row">
			    <h1 class="page-footer style="float:left; margin-top:0px; overflow:hidden; width:10% " class="col-xs-12 col-md-6"  >
					<i class="fa fa-globe"></i> TOTAL: '.$total. 
				  '</h1>
				   <div style="display:block; float:left; width:80%" class="col-xs-12 col-md-12 col-lg-12"  >
					<img alt="12345" src="./core/barcode.php?&size=40&text='.$barra.'" width="70%" height="60px" />
			   </div>
				
				</div>
			  </div>
			</section>
			</body>
		</html>';
		
		//$result = $html;
		
		/*
		
		<div style="display:block; float:left; width:80%" class="col-xs-12 col-md-12 col-lg-12"  >
					<img alt =" Barcoded value 1234567890" src="http://bwipjs-api.metafloor.com/?bcid=code128&text='.$barra.'&sccale=1&includetest"  width="70%" height="60px" >
			   </div>
		
		// Set parameters
		$apikey = 'bd8279ec-a2b7-4fb1-9972-3f063377b984';
													
		$postdata = http_build_query(
			array(
				'apikey' => $apikey,
				'value' => $html,
				'MarginBottom' => '30',
				'MarginTop' => '20'
			)
		);
		 
		$opts = array('http' =>
			array(
				'method'  => 'POST',
				'header'  => 'Content-type: application/x-www-form-urlencoded',
				'content' => $postdata
			)
		);
		
		 
		$context  = stream_context_create($opts);
		$result = file_get_contents('http://api.html2pdfrocket.com/pdf', false, $context);
		 
		// Save to root folder in website
		//file_put_contents('mypdf-1.pdf', $result);
		
		
		/*
		require 'pdfcrowd.php';

		// create an API client instance
		$client = new Pdfcrowd("username", "12345678");
		$result = $client->convertHtml($html);
		*/
		
		//$base64 = base64_encode($html);
		$archivo = 'entrega'.$idFactura.'.pdf';
		
		$json = array(
					'error'  => '',
					'nombreDocumento'  => $archivo,
					'html'  => $html
				);
		
		echo json_encode($json);
		
?>