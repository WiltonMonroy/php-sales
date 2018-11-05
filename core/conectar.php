
<?php

class conectar{

	var $servername = 'l127.0.0.1';
	var $username = "root";
	var $password = "";
	var $dbname = "mides";
	
	function EjecutarSelect($sql){
			
		$link = mysql_connect('127.0.0.1', 'root', '')  or die('No se pudo conectar: ' . mysql_error());

		mysql_select_db('mides') or die('No se pudo seleccionar la base de datos');

		$result = mysql_query($sql) or die('Consulta fallida select: ' . mysql_error());

		$registros = array();

		while ($line = mysql_fetch_assoc($result)){
			array_push($registros, $line);
		}			
			
		mysql_free_result($result);

		mysql_close($link);
	
		return $registros;
	}
	
	
	function EjecutarEscalar($sql){
			
		$link = mysql_connect('127.0.0.1', 'root', '')  or die('No se pudo conectar: ' . mysql_error());

		mysql_select_db("mides") or die('No se pudo seleccionar la base de datos');

		$result = mysql_query($sql) or die('Consulta fallida escalar: ' . mysql_error());
		
		$valor;

		while ($line = mysql_fetch_array($result )) { //MYSQL_ASSOC
			foreach ($line as $col_value) {
				$valor =  $col_value;
			}
		}
		
		mysql_free_result($result);

		mysql_close($link);
		
		return $valor;
	}
	
	
	function EjecutarInsert($sql){
			
		$link = mysql_connect('127.0.0.1', 'root', '')  or die('No se pudo conectar: ' . mysql_error());

		mysql_select_db("mides") or die('No se pudo seleccionar la base de datos');

		$result = mysql_query($sql) or die('Consulta fallida insert: ' . mysql_error() 	. $sql);
		
		$id = mysql_insert_id();
		
		//mysql_free_result($result);

		mysql_close($link);
		
		return $id;
	}
	
	
	function EjecutarUpdate($sql){
			
		$link = mysql_connect('127.0.0.1', 'root', '')  or die('No se pudo conectar: ' . mysql_error());

		mysql_select_db("mides") or die('No se pudo seleccionar la base de datos');

		$result = mysql_query($sql) or die('Consulta fallida update: ' . mysql_error());
		
		//mysql_free_result($result);

		mysql_close($link);
		
	}
	
}

?>