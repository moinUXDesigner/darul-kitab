<?php

/**
 * Database connection class for both local (Docker/XAMPP) and production (Hostinger).
 * 
 * - Environment is detected using $_SERVER['SERVER_NAME'].
 * - Docker: host = "db"
 * - Local (XAMPP): host = "localhost"
 * - Production: host = "localhost" (with production credentials)
 * 
 * To change credentials, edit the values in the relevant section below.
 */
class Database
{
    private string $host;
    private string $db;
    private string $user;
    private string $pass;
    public PDO $conn;

    public function __construct()
    {
        // Default to local environment if SERVER_NAME is not set
        $server = $_SERVER['SERVER_NAME'] ?? 'localhost';

        // --- ENVIRONMENT DETECTION ---
        // Docker: Use "db" as host (common in docker-compose)
        // XAMPP or other local: Use "localhost"
        // Production: Use "localhost" with production credentials
        if ($server === 'localhost' || $server === '127.0.0.1') {
            // LOCAL ENVIRONMENT
            // --- Docker or XAMPP switch ---
            // Set $useDocker = true if running in Docker, false for XAMPP
            $useDocker = false; // CHANGE THIS TO true IF USING DOCKER

            if ($useDocker) {
                $this->host = "db"; // Docker service name
            } else {
                $this->host = "localhost"; // XAMPP or similar
            }
            $this->db   = "darulkitab_db";
            $this->user = "root";
            $this->pass = "root";
        } else {
            // PRODUCTION (Hostinger)
            $this->host = "localhost"; // ✅ ALWAYS localhost for Hostinger DB
            $this->db   = "u484303972_darulkitab_db"; // confirm from hPanel
            $this->user = "u484303972_darulkitab";    // confirm from hPanel
            $this->pass = "AamirKhan@123#Hyderabad";
        }
    }

    /**
     * Connect to the database using PDO.
     * - Uses utf8mb4 charset and ERRMODE_EXCEPTION.
     * @return PDO
     */
    public function connect(): PDO
    {
        $this->conn = new PDO(
            "mysql:host={$this->host};dbname={$this->db};charset=utf8mb4",
            $this->user,
            $this->pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        return $this->conn;
    }
}
