#!/usr/bin/env python

import scrapy
from scrapy.crawler import CrawlerProcess

class CheggSpider(scrapy.Spider):
    name = "quotes"

    def start_requests(self):
        book = "calculus 8th edition"
        isbn = 1285741552
        isbn13 = 9781285741550
        urls = ['http://www.chegg.com/textbooks/{0}-{1}-{2}'.format(book.replace(" ","-"),isbn13,isbn)]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = 'chegg-%s.html' % page

        rent_tag = "\"type\":\"Rent\""

        with open(filename, 'wb') as f:
            #f.write(response.body)
            #f.write(response.body.css("script").extract())
            for s in response.css('script').extract():
                if s.find(rent_tag) !=  -1:
                    i = s.find(rent_tag)
                    priceLine = s[i+len(rent_tag)+10:]
                    price = priceLine[:priceLine.find("\"")]
                    print "\n\n\n{0}\n\n\n".format(price)
        self.log('Saved file %s' % filename)

        '''file2 = "log.txt"
        with open(file2, 'wb') as f:
            f.write(response.css("script").extract())'''

process = CrawlerProcess({
    'USER_AGENT': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'
})

process.crawl(CheggSpider)
process.start()
