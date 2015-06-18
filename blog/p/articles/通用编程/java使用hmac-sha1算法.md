#Java使用HMAC-SHA1算法
> 2015-02-21

```
String secret = mConsumerSecret + "&" + mOauthToken;

SecretKey secretKey = new SecretKeySpec(secret.getBytes("US-ASCII"), "HmacSHA1");
Mac mac = Mac.getInstance("HmacSHA1");
mac.init(secretKey);

byte[] text = builder.toString().getBytes("US-ASCII");
byte[] finalText = mac.doFinal(text);
String base64Text = Base64.encodeToString(finalText, Base64.DEFAULT);
return encode(base64Text.trim());
```