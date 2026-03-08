<?php
header('Content-Type: application/json');
include '../core/database.php';

// Get POST data
$author_name = $_POST['author_name'] ?? '';

if(empty($author_name)){
    echo json_encode([
        "success" => false,
        "message" => "Author name is required."
    ]);
    exit;
}

// Check if author already exists
$check = $conn->prepare("SELECT author_id FROM authors WHERE author_name=?");
$check->bind_param("s", $author_name);
$check->execute();
$check->store_result();

if($check->num_rows > 0){
    echo json_encode([
        "success" => false,
        "message" => "Author already exists."
    ]);
    exit;
}

// Insert new author
$stmt = $conn->prepare("INSERT INTO authors (author_name) VALUES (?)");
$stmt->bind_param("s", $author_name);

if($stmt->execute()){
    echo json_encode([
        "success" => true,
        "id_author" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>