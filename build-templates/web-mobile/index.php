<?php
	header("Content-Type:text/html; charset=utf8");
    
    define('SHAREAPPID', 'wxf1390c5456aaf77a');

	$id = '15413995524557';
	$iv = '5jVnM8FLDkHBdwyQ';
	$key = 'abcdefghijklmnop';
	$link = 'https://api.weq.me/wx/token.php?id='.$id.'&key='.$key;
	$result = file_get_contents($link);
	$result = json_decode($result, true);
	if($result['errcode'] == 0){
	    $aes = new CryptAES();
	    $aes->set_key($key);
	    $aes->set_iv($iv);
	    $aes->require_pkcs5();
	    $access_token = $aes->decrypt($result['access_token']);
	    $jsapi_ticket = $aes->decrypt($result['jsapi_ticket']);
	}else{
		$access_token = '';
		$jsapi_ticket = '';
	}

	$timestamp = time();
	$randomstr = getRandChar(32);

    $link = "http://".$_SERVER['SERVER_NAME'];
    if($_SERVER["SERVER_PORT"] != null && $_SERVER["SERVER_PORT"] != '80'){
        $link = $link.":".$_SERVER["SERVER_PORT"];
    }
    $link = $link.$_SERVER["REQUEST_URI"];

    $shastr = "jsapi_ticket=".$jsapi_ticket."&noncestr=".$randomstr."&timestamp=".$timestamp."&url=".$link;
    $signature = sha1($shastr);
    $link_share = $link;

    class CryptAES{
        protected $cipher     = MCRYPT_RIJNDAEL_128;
        protected $mode       = MCRYPT_MODE_CBC;
        protected $pad_method = NULL;
        protected $secret_key = '';
        protected $iv         = '';
     
        public function set_cipher($cipher)
        {
            $this->cipher = $cipher; 
        }
     
        public function set_mode($mode)
        {
            $this->mode = $mode;
        }
     
        public function set_iv($iv)
        {
            $this->iv = $iv;
        }
     
        public function set_key($key)
        {
            $this->secret_key = $key;
        }
     
        public function require_pkcs5()
        {
            $this->pad_method = 'pkcs5';
        }
     
        protected function pad_or_unpad($str, $ext)
        {
            if ( is_null($this->pad_method) )
            {
                return $str;
            }
            else 
            {
                $func_name = __CLASS__ . '::' . $this->pad_method . '_' . $ext . 'pad';
                if ( is_callable($func_name) )
                {
                    $size = mcrypt_get_block_size($this->cipher, $this->mode);
                    return call_user_func($func_name, $str, $size);
                }
            }
     
            return $str; 
        }
     
        protected function pad($str)
        {
            return $this->pad_or_unpad($str, ''); 
        }
     
        protected function unpad($str)
        {
            return $this->pad_or_unpad($str, 'un'); 
        }
     
     
        public function encrypt($str)
        {
            $str = $this->pad($str);
            $td = mcrypt_module_open($this->cipher, '', $this->mode, '');
     
            if ( empty($this->iv) )
            {
                $iv = @mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
            }
            else
            {
                $iv = $this->iv;
            }
            mcrypt_generic_init($td, $this->secret_key, $iv);
            $cyper_text = mcrypt_generic($td, $str);
            $rt = base64_encode($cyper_text);
            mcrypt_generic_deinit($td);
            mcrypt_module_close($td);
     
            return $rt;
        }
     
     
        public function decrypt($str){
            $td = mcrypt_module_open($this->cipher, '', $this->mode, '');
     
            if ( empty($this->iv) )
            {
                $iv = @mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
            }
            else
            {
                $iv = $this->iv;
            }
     
            mcrypt_generic_init($td, $this->secret_key, $iv);
            $decrypted_text = mdecrypt_generic($td, base64_decode($str));
            $rt = $decrypted_text;
            mcrypt_generic_deinit($td);
            mcrypt_module_close($td);
     
            return $this->unpad($rt);
        }
     
        public static function pkcs5_pad($text, $blocksize)
        {
            $pad = $blocksize - (strlen($text) % $blocksize);
            return $text . str_repeat(chr($pad), $pad);
        }
     
        public static function pkcs5_unpad($text){
            $pad = ord($text{strlen($text) - 1});
            if ($pad > strlen($text)) return false;
            if (strspn($text, chr($pad), strlen($text) - $pad) != $pad) return false;
            return substr($text, 0, -1 * $pad);
        }
    }

    function getRandChar($length){
        $str = null;
        $strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        $max = strlen($strPol)-1;

        for($i=0;$i<$length;$i++){
            $str.=$strPol[rand(0,$max)];//rand($min,$max)生成介于min和max两个数之间的一个随机整数
        }

        return $str;
    }
?>
<!DOCTYPE html>
<html lang="zh">
<head>
	<meta charset="UTF-8">
	<title></title>

	<meta name="format-detection" content="telephone=no">
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
</head>
<body>

    <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
	<script type="text/javascript">
	wx.config({
	    debug: true,
	    appId: '<?php echo SHAREAPPID; ?>',
	    link: '<?php echo $link; ?>',
	    timestamp: '<?php echo $timestamp; ?>',
	    nonceStr: '<?php echo $randomstr; ?>',
	    signature: '<?php echo $signature; ?>',
	    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo']
	});
	</script>
</body>
</html>