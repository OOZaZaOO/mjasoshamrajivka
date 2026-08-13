import Link from "next/link";

export function Footer() {
  return <footer id="footer" className="masnyi-footer"><div className="masnyi-footer__brand"><p className="masnyi-logo masnyi-logo--light">М&apos;ЯСНИЙ</p><p>LOCAL BUTCHER. СВІЖЕ, БО ВАЖЛИВО. ЧЕСНО,<br />БО ТАК ПРАВИЛЬНО.</p></div><div className="masnyi-footer__links"><div><Link href="#footer">Контакти</Link><Link href="#footer">Адреса</Link><Link href="#footer">Графік роботи</Link><Link href="/privacy">Політика конфіденційності</Link></div><p>© 2024 М&apos;ЯСНИЙ LOCAL BUTCHER. Усі права захищено.</p></div></footer>;
}
