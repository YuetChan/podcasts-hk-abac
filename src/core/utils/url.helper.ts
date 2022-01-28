export class UrlHelper {

  getResourceId(url, resrc): number {
    const urls = url.split('/');
    return parseInt(urls[urls.indexOf(resrc) + 1]);
  }

  contains(url: string, str: string): boolean {
    return url.includes(str);
  }

}