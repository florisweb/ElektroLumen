<?php
  function getIP(){
    if (!empty($_SERVER['HTTP_CLIENT_IP']))
    {
        return $_SERVER['HTTP_CLIENT_IP'];
    }

    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
    {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    return $_SERVER['REMOTE_ADDR'];
  }
  
  function getIdFromObject($_object) {
    return $_object['id'];
  }
?>
