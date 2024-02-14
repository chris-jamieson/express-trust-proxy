# Express Trust Proxy Test

A tiny utility to test how to configure Express in your hosting environment (e.g. Heroku) in order to access Client IP addresses while preventing IP Spoofing.

See [Express Docs](https://expressjs.com/en/5x/api.html#trust.proxy.options.table) for information on possible values.

## Usage

1. Deploy the app to your environment.
2. Set environment variable `PORT` (listner port number)
3. Set environment variable `TRUST_PROXY` according to the value you wish to test.
4. Make an HTTP GET request `https://your-url-here.com/`. Try spoofing your real IP address, see example commands below.
5. The client IP detected by Express will be returned in the response body.

## Supported options for `TRUST_PROXY` variable

### Boolean

e.g. `TRUE` or `FALSE`

If true, the client’s IP address is understood as the left-most entry in the X-Forwarded-\* header.

If false, the app is understood as directly facing the Internet and the client’s IP address is derived from req.connection.remoteAddress. This is the default setting.

### String

String OR String containing comma-separated values. e.g. `loopback` or `loopback, 123.123.123.123`

Defines an IP address, subnet, or an array of IP addresses, and subnets to trust. Pre-configured subnet names are:

- loopback - 127.0.0.1/8, ::1/128
- linklocal - 169.254.0.0/16, fe80::/10
- uniquelocal - 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7

### Number

e.g. `1`

Trust the nth hop from the front-facing proxy server as the client.

## IP Spoofing

Here are some example cURL commands that attempt to spoof the client IP address by setting the X-Forwarded-For header:

Spoof as a private IP address:

```sh
curl -H "X-Forwarded-For: 192.168.0.1" http://example.com
```

Spoof as a public IP address:

```sh
curl -H "X-Forwarded-For: 138.197.99.92" http://example.com
```

Spoof as multiple IP addresses:

```sh
curl -H "X-Forwarded-For: 203.0.113.195, 70.41.3.18, 138.197.99.92" http://example.com
```

Spoof the X-Real-IP header instead:

```sh
curl -H "X-Real-IP: 124.53.78.9" http://example.com
```

Set an invalid IP with different formats:

```sh
curl -H "X-Forwarded-For: 999.999.999.999" http://example.com
curl -H "X-Forwarded-For: 123.456.789" http://example.com
```

## Heroku

Following experiments with Heroku, it appears that the following allow the server to correctly get the request's client IP but prevent spoofing using request headers:

```js
app.set("trust proxy", 1);
```

```js
app.set("trust proxy", "uniquelocal");
```
