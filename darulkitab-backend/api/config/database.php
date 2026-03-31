<?php
class Database {
private string $host = "db";
private string $db = "darulkitab_db";
private string $user = "root";
private string $pass = "root";
public PDO $conn;


public function connect(): PDO {
$this->conn = new PDO(
"mysql:host={$this->host};dbname={$this->db};charset=utf8mb4",
$this->user,
$this->pass,
[PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
return $this->conn;
}
}
?>