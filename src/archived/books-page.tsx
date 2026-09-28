import Image from 'next/image';
import Link from 'next/link';
import { Frame } from '@/components/frame';
import { searchUrl, site } from '@/content/site';

export default function BooksPage() {
  return <Frame><div className="inner-page">
    <div className="sub-back"><Link href="/" className="back-link">← HOME</Link></div>
    <div className="sub-intro"><h1 className="serif">Favourite Books</h1><p>A showcase of books that left an impact on my thinking. Click a cover to search.</p></div>
    <div className="book-grid">{site.books.map(book => <div className="book-item" key={book.title}>
      <a className="book-cover" href={searchUrl(book.title)} target="_blank" rel="noopener noreferrer" aria-label={`Search for ${book.title}`}><Image src={book.cover} width={194} height={290} alt={book.title}/></a>
      <div className="book-caption"><strong>{book.title}</strong><span>{book.author}</span></div>
    </div>)}</div>
  </div></Frame>;
}
