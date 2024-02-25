---
title: HTMX ile Full-Stack Uygulama Geliştirmek
short: HTMX, son zamanlarda karşıma çıkan ve modern web uygulamalarından farklı yaklaşımıyla ilgimi çeken bir teknoloji oldu. Hypermedia Driven Architecture denen bir yapıyı temel alıyor ve bununla ilgili bir kitapları da mevcut. Bu kitapta HTMX’in çıkış amacından, nasıl kullanılacağına kadar güzel bilgiler yer alıyor.
date: 26/02/2024
---

HTMX, son zamanlarda karşıma çıkan ve modern web uygulamalarından farklı yaklaşımıyla ilgimi çeken bir teknoloji oldu. Hypermedia Driven Architecture denen bir yapıyı temel alıyor ve bununla ilgili bir kitapları da mevcut. Bu kitapta HTMX’in çıkış amacından, nasıl kullanılacağına kadar güzel bilgiler yer alıyor.

Kitaba [bu linke](https://hypermedia.systems/book/contents/) tıklayarak ulaşabilirsiniz.
![Hypermedia Systems](https://htmx.org/img/hypermedia-systems.png)

## Giriş

Dökümanı incelerseniz HTMX’in çıkış motivasyonu “Neden sadece `<a>` & `<form>` tagleri HTTP isteği yapmalı?”, “Neden sadece click & submit eventleri tetikleyici olarak kullanılsın?” gibi sorulara dayanıyor.

Anlayacağınız üzere bu teknoloji Vue veya Angular gibi araçlar kullananların aşina olacağı üzere HTML taglerini ve eventlerini etkili bir biçimde kullanmayı amaçlıyor.

Bunları zaten SPA frameworkleri çıkmadan önce de yapıyorduk diyebilirsiniz. Ama sadece bu kadar da değil. HTMX bir sayfada sanal DOM olmadan AJAX isteği yapıyor ve sonucuna göre DOM üzerinde manipülasyon yapabiliyor.
![DOM Manipulation](https://miro.medium.com/v2/resize:fit:618/1*0poukmfxSJxjiY3-b6CKIA.png)

Bunun anlamı sayfa yenilemeye ihtiyaç olmadan interaktif işlemler ve sayfa geçişleri yapabiliyor. Önemli nokta bu isteklerin cevaplarını JSON olarak değil HTML render ederek yapmalısınız. Uç noktalara gelen istekler render işlemi de dahil bütün işlemler tamamlandıktan sonra sonuç HTML dönülüyor ve DOM üzerinde istenen yere çiziliyor.

## Ben neden sevdim?

Küçük ve orta çaplı projeler için front-end ve back-end ayrı projeler kurmak, bu iki proje arasında http istekleri ile JSON iletişimi kurmak vs gibi işlemler bana developer experience açısından çok zahmetli geliyor.

Bu sebeple; şöyle mikroservis kuralım, böyle load balancing yapalım, yüke göre sistemi ölçekleyelim vs. gibi dertlerinizin olmadığı bir proje geliştiriyorsanız (örn. blog sayfam) HTMX bunun için çok kullanışlı bir araç olacaktır.

Sadece bir web uygulaması ayağa kaldırarak fikrinizi hayata geçirebilirsiniz. Dil bağımsız olması da cabası. İnternette gördüğüm örneklerin çoğu Go+HTMX kullanıyordu fakat işin güzelliği tek ihtiyacınız olan web uygulaması geliştirecek bir dil olduğundan ben NodeJS’i tercih ettim.

## Nasıl Kullanılır?

### Kurulum

Kurulumu oldukça basit. CDN ile kolaylıkla projenize ekleyebilirsiniz.

```html
<script
  src="https://unpkg.com/htmx.org@1.9.10"
  integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
  crossorigin="anonymous"
></script>
```

> Veya minify edilmiş halini dökümandan indirerek projenize ekleyebilirsiniz.

### İstekler

HTMX, HTML taglerinde `hx-` prefix’ini kullanıyor. Herhangi bir tag üzerinden AJAX istekleri (GET, POST, PUT) yapabilirsiniz.

Örnek olarak aşağıdaki div elementi `/latest-posts` uç noktasına `GET` isteği atar.

```html
<div hx-get="/latest-posts">Son postları getir</div>
```

### Tetikleyiciler

AJAX isteği oluşturmayı öğrendik fakat bu isteklerin ne zaman yapılacağını da belirleyebilirsiniz.

"Butona tıklandığı zaman", “Sayfa yüklendiğinde“ gibi tetikleyiciler mevcut.

Dökümanda yer alan bu örnekte input elementine her tuşa basıldığında (==keyup==), eğer değer değiştiyse (==changed==), 500ms bekledikten sonra (==delay:500ms==) kuralları eklenmiş.

```html
<input
  type="text"
  name="q"
  hx-get="/trigger_delay"
  hx-trigger="keyup changed delay:500ms"
  hx-target="#search-results"
  placeholder="Search..."
/>
<div id="search-results"></div>
```

Bu element ilgili kurallar sağlandığında `/trigger_delay` uç noktasına istek atar.

Hatta şu tuşa basıldığında gibi spesifik bir kural bile belirleyebilirsiniz:

```html
<div hx-get="/clicked" hx-trigger="click[ctrlKey]">Control Click Me</div>
```

### Hedef

AJAX isteğini yaptıktan sonra uç noktadan dönen sonucun nereye çizileceğini `hx-target` ve `hx-swap` ile belirleyebilirsiniz.

İlk bölümde bahsettiğim DOM manipülasyonu burada başlıyor. DOM üzerinde bir CSS selector belirterek (class, id) bu elemanın içine, sonuna, başına ekle gibi DOM işlemleri yapabiliyoruz.

**Örnek;**

- Sayfa yüklendiğinde
- `/latest-post` uç noktasına `GET` isteği at
- dönen cevabı `#posts` elementinin `içine` gönder.

```html
<div
  hx-get="/latest-posts"
  hx-trigger="load"
  hx-target="#posts"
  hx-swap="innerHTML"
>
  Son postları getir.
</div>
<div id="posts"></div>
```

### Boosting

HTMX normalde kullandığınız `<a>` ve `<form>` elementlerini AJAX isteği yapacak şekilde “**boostlayabiliyor**”.

Bu sayede uygulama içerisinde bir sayfaya a tagı ile yönlendirdiğinizde sayfa yenilenmeden AJAX isteği atılıyor ve body güncellenerek akıcı bir SPA deneyimi yaşatıyor.

```html
<div hx-boost="true">
  <a href="/blog">Blog</a>
</div>
```

## Uygulama

Ben web uygulaması için halihazırda aktif kullandığım expressjs’i tercih ettim. Pug’ı da HTML render etmek ve UI işlemleri için kullandım.

> Pug default olarak `views` isimli dizindeki dosyaları render ediyor. Bu durumda `res.render("home")` ile `/views/home.pug` dizinindeki template render edilecektir.

---

Anasayfada son postların listelendiği bir uygulama oluşturalım. Bunun için öncelikle `GET /` uç noktasından `home` adında bir pug template’i render edeceğiz. Ve son postları `posts` adında bir pug template’i render ederek döndüren bir uç noktaya ihtiyacımız olacak.

Öncelikle bir node projesi oluşturuyoruz.

```bash
mkdir htmx-deneme
cd htmx-deneme
npm init -y
```

Gerekli paketleri indiriyoruz.

```bash
npm install express pug
```

Express uygulaması oluşturuyoruz.

```javascript
// index.js
const express = require("express");
const pug = require("pug");
const path = require("path");

const app = express();

// Pug render kullanmak için
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/latest-posts", (req, res) => {
  const posts = ["hello world"];

  const dir = path.join(__dirname, "./views/posts.pug");
  const render = pug.compileFile(dir);

  return res.send(render({ posts }));
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
```

```pug
// views/home.pug
doctype html

html(lang="en")
 	head
		script(src="https://unpkg.com/htmx.org@1.9.10" integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC" crossorigin="anonymous")
		title Hello World!

	body(hx-boost="true")
		div(
			hx-get="/latest-posts"
			hx-trigger="load"
			hx-target="#posts"
			hx-swap="innerHTML"
		) Son postları getir.
		div#posts
```

```pug
// views/posts.pug
ul
	each post in posts
		li #{post}
```

Son olarak uygulamayı ayağa kaldırıyoruz.

```bash
node index.js
```

`GET /` uç noktası pug ile home template’ini render ediyor ve ekranda “Son postları getir” yazısını görüyoruz.

Bu sırada `load` trigger’ı ile sayfa yüklendiği anda `GET /latest-posts` uç noktasına istek atıyor ve express uygulamamız ilgili postları pug template ile render ettikten sonra döndürüyor ve HTMX bu cevabı `#posts` elementinin `innerHTML` alanına çiziyor.

Aslında tek yaptığımız bir uygulama ayağa kaldırmak ve tüm logicleri hallettikten sonra render ederek bunu ilgili uç noktadan döndürmek. Gerisini HTMX sorunsuz bir şekilde hallediyor.

## Sonuç

HTMX’in bu anlattıklarım dışında bir çok özelliği mevcut. Fakat bir yazıda tüm bunlara deyinmek çok zor. Büyük projelerde karmaşıklığa sebep olacağını ve UI ile logic kısmı çok iç içe geçirdiğini düşünsem de birkaç projede daha bu teknolojiye şans vermek istiyorum.

Dökümanı çok sade ve açıklayıcı hazırlanmış, göz atmanızı tavsiye ederim.

Son olarak kendi blog sayfamı da HTMX ile geliştirdim ve kodlarını GitHub’a yükledim. İncelemek isterseniz [buraya tıklayarak](https://github.com/akseyh/homepage/tree/master) göz atabilirsiniz.
