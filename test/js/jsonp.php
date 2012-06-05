<?php
$data = '{ "foo": "bar" }';
if (isset($_GET['callback'])) {
    echo $_GET['callback'] . '(' . $data . ');';
}
