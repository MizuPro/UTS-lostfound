<?php
require 'BackendLostFound/config/config.php';
require 'BackendLostFound/config/Database.php';
require 'BackendLostFound/models/UserModel.php';
require 'BackendLostFound/helpers/JwtHelper.php';
\ = Database::getInstance()->getConnection();
\ = new UserModel(\);
\ = \->findByEmail('petugas@example.com'); // assuming default
if (!\) {
    echo \"No petugas found\n\";
    exit;
}
\ = [
    'user_id' => \['user_id'],
    'role'    => \['role'],
];
\ = JwtHelper::generate(\);
echo \;
