module("core/base:navigator");

var userAgents = 'msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; Win 9x 4.90; http://www.Abolimba.de)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; JyxoToolbar1.0; http://www.Abolimba.de; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; .NET CLR 1.1.4322)\n\
	0	Mozilla/5.0 (compatible; ABrowse 0.4; Syllable)\n\
webkit	420	Mozilla/5.0 (compatible; U; ABrowse 0.6; Syllable) AppleWebKit/420+ (KHTML, like Gecko)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Acoo Browser; InfoPath.2; .NET CLR 2.0.50727; Alexa Toolbar)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; Acoo Browser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)\n\
	0	amaya/9.52 libwww/5.4.0\n\
	0	amaya/11.1 libwww/5.4.0\n\
	0	Amiga-AWeb/3.5.07 beta\n\
	0	AmigaVoyager/3.4.4 (MorphOS/PPC native)\n\
	0	AmigaVoyager/2.95 (compatible; MC680x0; AmigaOS)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; AOL 7.0; Windows NT 5.1; FunWebProducts)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; AOL 8.0; Windows NT 5.1; SV1)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.0; Windows NT 5.1; .NET CLR 1.1.4322; Zango 10.1.181.0)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; AOL 6.0; Windows NT 5.1)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.5; AOLBuild 4337.35; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)\n\
webkit	523.15	Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)\n\
webkit	527	Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6\n\
webkit	523.15	Mozilla/5.0 (X11; U; Linux; C -) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.5\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; Avant Browser; Avant Browser; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.1)\n\
	0	Avant Browser (http://www.avantbrowser.com)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; JyxoToolbar1.0;  Embedded Web Browser from: http://bsalsa.com/; Avant Browser; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; .NET CLR 1.1.4322)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; GTB5; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; Avant Browser)\n\
mozilla	0	Mozilla/5.0 (Windows; U; Win9x; en; Stable) Gecko/20020911 Beonex/0.8.1-stable\n\
mozilla	0	Mozilla/5.0 (Windows; U; WinNT; en; Preview) Gecko/20020603 Beonex/0.8-stable\n\
mozilla	1.0.2	Mozilla/5.0 (Windows; U; WinNT; en; rv:1.0.2) Gecko/20030311 Beonex/0.8.2-stable\n\
mozilla	1.9	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9) Gecko/2008120120 Blackbird/0.9991\n\
webkit	527	Mozilla/5.0 (X11; 78; CentOS; US-en) AppleWebKit/527+ (KHTML, like Gecko) Bolt/0.862 Version/3.0 Safari/523.15\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; Browzar)\n\
	0	Bunjalloo/0.7.4(Nintendo DS;U;en)\n\
	0	Bunjalloo/0.7.6(Nintendo DS;U;en)\n\
mozilla	1.8.1.4pre	Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; en; rv:1.8.1.4pre) Gecko/20070511 Camino/1.6pre\n\
mozilla	1.7.2	Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; en-US; rv:1.7.2) Gecko/20040825 Camino/0.8.1\n\
mozilla	1.8.1.12	Mozilla/5.0 (Macintosh; U; Intel Mac OS X Mach-O; en; rv:1.8.1.12) Gecko/20080206 Camino/1.5.5\n\
mozilla	1.0.1	Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; en-US; rv:1.0.1) Gecko/20030111 Chimera/0.6\n\
mozilla	1.8.0.10	Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; en-US; rv:1.8.0.10) Gecko/20070228 Camino/1.0.4\n\
webkit	418.9	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/418.9 (KHTML, like Gecko, Safari) Safari/419.3 Cheshire/1.0.ALPHA\n\
webkit	419	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/419 (KHTML, like Gecko, Safari/419.3) Cheshire/1.0.ALPHA\n\
webkit	525.19	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/1.0.154.36 Safari/525.19\n\
webkit	525.19	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/1.0.154.53 Safari/525.19\n\
mozilla	1.9.0.10	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.10) Gecko/2009042815 Firefox/3.0.10 CometBird/3.0.10\n\
mozilla	1.9.0.5	Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.5) Gecko/2009011615 Firefox/3.0.5 CometBird/3.0.5\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; Crazy Browser 3.0.0 Beta2)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; Crazy Browser 2.0.1)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; Crazy Browser 1.0.5; .NET CLR 1.1.4322; InfoPath.1)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; Deepnet Explorer 1.5.0; .NET CLR 1.0.3705)\n\
webkit	525.27.1	Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_6; en-us) AppleWebKit/525.27.1 (KHTML, like Gecko) Demeter/1.0.9 Safari/125\n\
webkit	312.8	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; pl-pl) AppleWebKit/312.8 (KHTML, like Gecko, Safari) DeskBrowse/1.0\n\
	0	Dillo/0.8.5\n\
	0	Dillo/2.0\n\
mozilla	0	DocZilla/1.0 (Windows; U; WinNT4.0; en-US; rv:1.0.0) Gecko/20020804\n\
mozilla	0	DocZilla/2.7 (Windows; U; Windows NT 5.1; en-US; rv:2.7.0) Gecko/20050706 CiTEC Information\n\
webkit	527	Mozilla/5.0 (Windows; U; Windows NT 5.1; cs-CZ) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3)  Dooble\n\
	0	Doris/1.15 [en] (Symbian)\n\
	0	edbrowse/1.5.17-2\n\
	0	edbrowse/2.2.10\n\
	0	edbrowse/3.1.2-1\n\
	0	ELinks/0.13.GIT (textmode; Linux 2.6.22-2-686 i686; 148x68-3)\n\
	0	ELinks/0.9.3 (textmode; Linux 2.6.11 i686; 79x24)\n\
	0	Enigma Browser\n\
mozilla	1.8.1.12	Mozilla/5.0 (X11; U; Linux i686; en; rv:1.8.1.12) Gecko/20080208 (Debian-1.8.1.12-2) Epiphany/2.20\n\
mozilla	1.9.0.12	Mozilla/5.0 (X11; U; Linux x86_64; en; rv:1.9.0.12) Gecko/20080528 Fedora/2.24.3-8.fc10 Epiphany/2.22 Firefox/3.0\n\
mozilla	1.7.3	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7.3) Gecko/20041007 Epiphany/1.4.7\n\
mozilla	1.5	Mozilla/5.0 (Windows; U; Win98; en-US; rv:1.5) Gecko/20031007 Firebird/0.7\n\
mozilla	1.5	Mozilla/5.0 (Windows; U; Win95; en-US; rv:1.5) Gecko/20031007 Firebird/0.7\n\
mozilla	1.8.0.3	Mozilla/5.0 (Windows; U; Windows NT 5.0; es-ES; rv:1.8.0.3) Gecko/20060426 Firefox/1.5.0.3\n\
mozilla	1.9.1b2	Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; ko; rv:1.9.1b2) Gecko/20081201 Firefox/3.1b2\n\
mozilla	1.9.0.8	Mozilla/5.0 (Windows; U; Windows NT 5.1; cs; rv:1.9.0.8) Gecko/2009032609 Firefox/3.0.8\n\
mozilla	1.7.9	Mozilla/5.0 (Windows; U; WinNT4.0; en-US; rv:1.7.9) Gecko/20050711 Firefox/1.0.5\n\
mozilla	1.9b5	Mozilla/5.0 (X11; U; SunOS sun4u; en-US; rv:1.9b5) Gecko/2008032620 Firefox/3.0b5\n\
mozilla	1.8.0.5	Mozilla/5.0 (X11; U; OpenBSD i386; en-US; rv:1.8.0.5) Gecko/20060819 Firefox/1.5.0.5\n\
mozilla	1.9.1b3	Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3) Gecko/20090305 Firefox/3.1b3 GTB5\n\
mozilla	1.8.1.12	Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.8.1.12) Gecko/20080214 Firefox/2.0.0.12\n\
mozilla	1.8.1.9	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.9) Gecko/20071113 BonEcho/2.0.0.9\n\
mozilla	1.8.1	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1) Gecko/20061026 BonEcho/2.0\n\
mozilla	1.8.1.21pre	Mozilla/5.0 (BeOS; U; Haiku BePC; en-US; rv:1.8.1.21pre) Gecko/20090227 BonEcho/2.0.0.21pre\n\
mozilla	1.9.0.8	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko/2009033017 GranParadiso/3.0.8\n\
mozilla	1.9.2a2pre	Mozilla/5.0 (Windows; U; Windows NT 6.1; cs; rv:1.9.2a2pre) Gecko/20090912 Namoroka/3.6a2pre (.NET CLR 3.5.30729)\n\
mozilla	1.9.2a2pre	Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2a2pre) Gecko/20090901 Ubuntu/9.10 (karmic) Namoroka/3.6a2pre\n\
mozilla	1.9.2a1	Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2a1) Gecko/20090806 Namoroka/3.6a1\n\
mozilla	1.9.1b3pre	Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.1b3pre) Gecko/20090109 Shiretoko/3.1b3pre\n\
mozilla	1.9.1b4pre	Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1b4pre) Gecko/20090311 Shiretoko/3.1b4pre\n\
mozilla	1.8.0.1	Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; en-US; rv:1.8.0.1) Gecko/20060314 Flock/0.5.13.2\n\
mozilla	1.9.0.2	Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.2) Gecko/2008092122 Firefox/3.0.2 Flock/2.0b3\n\
webkit	525.13	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.13 (KHTML, like Gecko) Fluid/0.9.4 Safari/525.13\n\
mozilla	1.7.12	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7.12) Gecko/20050929 Galeon/1.3.21\n\
mozilla	1.9.0.8	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko/20090327 Galeon/2.0.7\n\
mozilla	1.9.1.5	Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.5) Gecko/20091105 Firefox/3.5.5 compat GlobalMojo/1.5.5 GlobalMojoExt/1.5\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; GreenBrowser)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; GreenBrowser)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; InfoPath.1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; GreenBrowser)\n\
	0	HotJava/1.1.2 FCS\n\
	0	Mozilla/3.0 (x86 [cs] Windows NT 5.1; Sun)\n\
mozilla	1.8.0.3	Mozilla/5.1 (X11; U; Linux i686; en-US; rv:1.8.0.3) Gecko/20060425 SUSE/1.5.0.3-7 Hv3/alpha\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SIMBAR={CFBFDAEA-F21E-4D6E-A9B0-E100A69B860F}; Hydra Browser; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.0.04506.30)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; Hydra Browser; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)\n\
	0	IBrowse/2.3 (AmigaOS 3.9)\n\
	0	Mozilla/5.0 (compatible; IBrowse 3.0; AmigaOS4.0)\n\
	0	iCab/4.0 (Macintosh; U; Intel Mac OS X)\n\
	0	Mozilla/4.5 (compatible; iCab 2.9.1; Macintosh; U; PPC)\n\
	0	iCab/3.0.2 (Macintosh; U; PPC Mac OS X)\n\
	0	ICE Browser/v5_4_3 (Java 1.4.2; Windows XP 5.1 x86)\n\
	0	Mozilla/5.0 (Java 1.6.0_01; Windows XP 5.1 x86; en) ICEbrowser/v6_1_2\n\
	0	ICE Browser/5.05 (Java 1.4.0; Windows 2000 5.0 x86)\n\
mozilla	1.8.1.9	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.9) Gecko/20071030 Iceape/1.1.6 (Debian-1.1.6-3)\n\
mozilla	1.8.1.8	Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.8.1.8) Gecko/20071008 Iceape/1.1.5 (Ubuntu-1.1.5-1ubuntu0.7.10)\n\
mozilla	1.9.0.3	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.3) Gecko/2008092921 IceCat/3.0.3-g1\n\
mozilla	1.8.1.11	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.11) Gecko/20071203 IceCat/2.0.0.11-g1\n\
mozilla	1.9.0.5	Mozilla/5.0 (X11; U; Linux i686; de; rv:1.9.0.5) Gecko/2008122011 Iceweasel/3.0.5 (Debian-3.0.5-1)\n\
mozilla	1.8.1.1	Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.8.1.1) Gecko/20061205 Iceweasel/2.0.0.1 (Debian-2.0.0.1+dfsg-4)\n\
mozilla	1.9.0.5	Mozilla/5.0 (X11; U; Linux i686; it; rv:1.9.0.5) Gecko/2008122011 Iceweasel/3.0.5 (Debian-3.0.5-1)\n\
msie	4.0	Mozilla/2.0 (compatible; MSIE 4.0; Windows 98)\n\
msie	6.0	Mozilla/4.0 (Windows; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)\n\
msie	7.0	Mozilla/4.0 (Mozilla/4.0; MSIE 7.0; Windows NT 5.1; FDM; SV1; .NET CLR 3.0.04506.30)\n\
msie	5.01	Mozilla/4.0 (compatible; MSIE 5.01; Windows NT)\n\
msie	8.0	Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 1.1.4322; InfoPath.2; .NET CLR 3.5.21022; .NET CLR 3.5.30729; MS-RTC LM 8; OfficeLiveConnector.1.4; OfficeLivePatch.1.3; .NET CLR 3.0.30729)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322; Media Center PC 4.0; .NET CLR 2.0.50727)\n\
msie	5.0b1	Mozilla/4.0 (compatible; MSIE 5.0b1; Mac_PowerPC)\n\
msie	5.0	Mozilla/4.0 (compatible; MSIE 5.0; Windows NT;)\n\
msie	5.23	Mozilla/4.0 (compatible; MSIE 5.23; Mac_PowerPC)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; GTB6; Ant.com Toolbar 1.6; MSIECrawler)\n\
msie	8.0	Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; GTB5; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506; InfoPath.2; OfficeLiveConnector.1.3; OfficeLivePatch.0.0)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 1.1.4322; InfoPath.2; .NET CLR 3.5.21022; .NET CLR 3.5.30729; MS-RTC LM 8; OfficeLiveConnector.1.4; OfficeLivePatch.1.3; .NET CLR 3.0.30729)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; InfoPath.2)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; iRider 2.21.1108; FDM)\n\
webkit	528.5	Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/528.5 (KHTML, like Gecko) Iron/0.4.155.0 Safari/528.5\n\
webkit	528.7	Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/528.7 (KHTML, like Gecko) Iron/1.0.155.0 Safari/528.7\n\
webkit	525.19	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Iron/0.2.152.0 Safari/12081672.525\n\
webkit	531.0	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/531.0 (KHTML, like Gecko) Iron/3.0.189.0 Safari/531.0\n\
mozilla	1.8.1.19	Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.8.1.19) Gecko/20081217 K-Meleon/1.5.2\n\
mozilla	1.8.1.21	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.21) Gecko/20090331 K-Meleon/1.5.3\n\
mozilla	1.8.0.5	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.0.5) Gecko/20060706 K-Meleon/1.0\n\
mozilla	1.8.1.21	Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.8.1.21) Gecko/20090331 K-Meleon/1.5.3\n\
mozilla	1.8.0.6	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.0.6) Gecko/20060731 K-Ninja/2.0.2\n\
mozilla	1.8.1.4pre	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.4pre) Gecko/20070404 K-Ninja/2.1.3\n\
mozilla	1.8.1.2pre	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070215 K-Ninja/2.1.1\n\
mozilla	1.9	Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0\n\
mozilla	0	Mozilla/5.0 (X11; Linux i686; U;) Gecko/20070322 Kazehakase/0.4.5\n\
mozilla	1.9.0.8	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; KKman2.0)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; KKMAN3.2)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; KKman3.0)\n\
	0	Mozilla/5.0 (compatible; Konqueror/3.1-rc5; i686 Linux; 20020712)\n\
	0	Mozilla/5.0 (compatible; Konqueror/4.3; Windows) KHTML/4.3.0 (like Gecko)\n\
	0	Mozilla/5.0 (compatible; Konqueror/2.2.1; Linux)\n\
	0	Mozilla/5.0 (compatible; Konqueror/3.5; SunOS)\n\
	0	Mozilla/5.0 (compatible; Konqueror/4.1; OpenBSD) KHTML/4.1.4 (like Gecko)\n\
	0	Links (0.96; Linux 2.4.20-18.7 i586)\n\
	0	Links (0.98; Win32; 80x25)\n\
	0	Links (2.1pre18; Linux 2.4.31 i686; 100x37)\n\
	0	Links (2.1; Linux 2.6.18-gentoo-r6 x86_64; 80x24)\n\
	0	Links (2.2; Linux 2.6.25-gentoo-r9 sparc64; 166x52)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Linux 2.6.26-1-amd64) Lobo/0.98.3\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows XP 5.1) Lobo/0.98.4\n\
	0	Mozilla/4.0 (compatible; Lotus-Notes/5.0; Windows-NT)\n\
	0	Mozilla/4.0 (compatible; Lotus-Notes/6.0; Windows-NT)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; .NET CLR 1.1.4322; Lunascape 2.1.3)\n\
mozilla	1.9.1b3pre	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1b3pre) Gecko/2008 Lunascape/4.9.9.98\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; JyxoToolbar1.0; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; .NET CLR 1.1.4322; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; Lunascape 5.1.4.5)\n\
webkit	528	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/528+ (KHTML, like Gecko, Safari/528.0) Lunascape/5.0.2.0\n\
mozilla	1.9.1.2	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1.2) Gecko/20090804 Firefox/3.5.2 Lunascape/5.1.4.5\n\
	0	Lynx/2.8.6rel.4 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.6.3\n\
	0	Lynx/2.8.3dev.6 libwww-FM/2.14\n\
	0	Lynx/2.8.5dev.16 libwww-FM/2.14 SSL-MM/1.4.1 OpenSSL/0.9.7a\n\
mozilla	1.7.12	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.12) Gecko/20051001 Firefox/1.0.7 Madfox/0.3.2u3\n\
webkit	530.6	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/530.6 (KHTML, like Gecko) Maxthon/3.0 Safari/530.6\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; SV1; Maxthon; .NET CLR 1.1.4322)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; MyIE2)\n\
msie	8.0	Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; MAXTHON 2.0)\n\
	0	Midori/0.1.7\n\
webkit	532	Midori/0.1.5 (X11; Linux; U; en-gb) WebKit/532+\n\
mozilla	1.0.1	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.0.1) Gecko/20020919\n\
mozilla	1.7.12	Mozilla/5.0 (Windows; U; Windows NT 5.0; it-IT; rv:1.7.12) Gecko/20050915\n\
mozilla	1.4	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.4; MultiZilla v1.5.0.0f) Gecko/20030624\n\
mozilla	1.2.1	Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.2.1; MultiZilla v1.1.32 final) Gecko/20021130\n\
	0	NCSA_Mosaic/2.0 (Windows 3.1)\n\
	0	NCSA_Mosaic/3.0 (Windows 95)\n\
	0	NCSA Mosaic/1.0 (X11;SunOS 4.1.4 sun4m)\n\
	0	NCSA_Mosaic/2.6 (X11; SunOS 4.1.3 sun4m)\n\
	0	Mozilla/3.01 (compatible; Netbox/3.5 R92; Linux 2.2)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; NetCaptor 7.5.4; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; .NET CLR 1.1.4322; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)\n\
msie	5.01	Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; NetCaptor 6.5.0RC1)\n\
mozilla	1.7.5	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.5) Gecko/20060127 Netscape/8.1\n\
	0	Mozilla/4.04 [en] (X11; I; IRIX 5.3 IP22)\n\
mozilla	0.9.2	Mozilla/5.0 (Windows; U; Win 9x 4.90; de-DE; rv:0.9.2) Gecko/20010726 Netscape6/6.1\n\
mozilla	1.8.1.12	Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.8.1.12) Gecko/20080219 Firefox/2.0.0.12 Navigator/9.0.0.6\n\
	0	Mozilla/4.08 [en] (WinNT; U ;Nav)\n\
mozilla	1.0.2	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.0.2) Gecko/20030208 Netscape/7.02\n\
	0	Mozilla/3.0 (Win95; I)\n\
	0	Mozilla/4.51 [en] (Win98; U)\n\
	0	NetSurf/2.0 (RISC OS; armv3l)\n\
	0	NetSurf/1.2 (Linux; i686)\n\
	0	Mozilla/4.7 (compatible; OffByOne; Windows 2000)\n\
	0	Mozilla/4.7 (compatible; OffByOne; Windows 98)\n\
	0	Mozilla/4.5 (compatible; OmniWeb/4.1.1-v424.6; Mac_PowerPC)\n\
	0	OmniWeb/2.7-beta-3 OWF/1.0\n\
webkit	420	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en-US) AppleWebKit/420+ (KHTML, like Gecko, Safari) OmniWeb/v595\n\
opera	6.0	Opera/6.0 (Windows 2000; U) [fr]\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Opera 7.10 [en]\n\
opera	10.00	Opera/9.80 (Windows NT 5.1; U; cs) Presto/2.2.15 Version/10.00\n\
opera	5.11	Opera/5.11 (Windows 98; U) [en]\n\
opera	9.51	Opera/9.51 (Macintosh; Intel Mac OS X; U; en)\n\
msie	5.0	Mozilla/4.0 (compatible; MSIE 5.0; Windows NT 4.0) Opera 6.01 [en]\n\
opera	9.02	Opera/9.02 (Windows XP; U; ru)\n\
msie	5.0	Mozilla/4.0 (compatible; MSIE 5.0; Windows 98) Opera 5.12 [en]\n\
opera	9.70	Opera/9.70 (Linux i686 ; U; en) Presto/2.2.1\n\
opera	7.03	Opera/7.03 (Windows NT 5.0; U) [en]\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 9.24\n\
mozilla	1.9.0.7	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009030821 Firefox/3.0.7 Orca/1.1 build 2\n\
mozilla	1.9.0.6	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.6) Gecko/2009022300 Firefox/3.0.6 Orca/1.1 build 1\n\
	0	Mozilla/1.10 [en] (Compatible; RISC OS 3.70; Oregano 1.10)\n\
webkit	530.0	Mozilla/5.0 (compatible; Origyn Web Browser; AmigaOS 4.1; ppc; U; en) AppleWebKit/530.0+ (KHTML, like Gecko, Safari/530.0+)\n\
webkit	531.0	Mozilla/5.0 (compatible; Origyn Web Browser; AmigaOS 4.0; U; en) AppleWebKit/531.0+ (KHTML, like Gecko, Safari/531.0+)\n\
webkit	528.5	Mozilla/5.0 (compatible; Origyn Web Browser; MorphOS; PPC; U) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; PhaseOut-www.phaseout.net)\n\
mozilla	1.4a	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.4a) Gecko/20030411 Phoenix/0.5\n\
mozilla	1.2b	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.2b) Gecko/20021029 Phoenix/0.4\n\
webkit	527	Mozilla/5.0 (Windows; U; Windows NT 5.1; cs-CZ) AppleWebKit/527+ (KHTML, like Gecko)  QtWeb Internet Browser/2.5 http://www.QtWeb.net\n\
webkit	527	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/527+ (KHTML, like Gecko) QtWeb Internet Browser/1.2 http://www.QtWeb.net\n\
webkit	527	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/527+ (KHTML, like Gecko) QtWeb Internet Browser/1.7 http://www.QtWeb.net\n\
webkit	527	Mozilla/5.0 (X11; U; Linux; cs-CZ) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3)  rekonq\n\
	0	retawq/0.2.6c [en] (text)\n\
webkit	312.8	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en-us) AppleWebKit/312.8 (KHTML, like Gecko) Safari/312.6\n\
webkit	528.16	Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_5_6; it-it) AppleWebKit/528.16 (KHTML, like Gecko) Version/4.0 Safari/528.16\n\
webkit	523.15	Mozilla/5.0 (Windows; U; Windows NT 5.1; cs-CZ) AppleWebKit/523.15 (KHTML, like Gecko) Version/3.0 Safari/523.15\n\
webkit	125.2	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; de-de) AppleWebKit/125.2 (KHTML, like Gecko) Safari/125.7\n\
webkit	528.16	Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/528.16 (KHTML, like Gecko) Version/4.0 Safari/528.16\n\
webkit	420	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; fi-fi) AppleWebKit/420+ (KHTML, like Gecko) Safari/419.3\n\
mozilla	1.8.1.13	Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en-US; rv:1.8.1.13) Gecko/20080313 SeaMonkey/1.1.9\n\
mozilla	1.9.1a2pre	Mozilla/5.0 (X11; U; Linux i686; rv:1.9.1a2pre) Gecko/20080824052448 SeaMonkey/2.0a1pre\n\
mozilla	1.8.1.6	Mozilla/5.0 (Windows; U; Win 9x 4.90; en-GB; rv:1.8.1.6) Gecko/20070802 SeaMonkey/1.1.4\n\
mozilla	1.9.1b3pre	Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1b3pre) Gecko/20081208 SeaMonkey/2.0a3pre\n\
mozilla	1.9a1	Mozilla/5.0 (BeOS; U; BeOS BePC; en-US; rv:1.9a1) Gecko/20060702 SeaMonkey/1.5a\n\
mozilla	1.9.1b3pre	Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3pre) Gecko/20081202 SeaMonkey/2.0a2\n\
webkit	419	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; ja-jp) AppleWebKit/419 (KHTML, like Gecko) Shiira/1.2.3 Safari/125\n\
webkit	417.9	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/417.9 (KHTML, like Gecko, Safari) Shiira/1.1\n\
webkit	418.9.1	Mozilla/5.0 (Macintosh; U; Intel Mac OS X; fr) AppleWebKit/418.9.1 (KHTML, like Gecko) Shiira Safari/125\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Sleipnir/2.8.1\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; InfoPath.1; .NET CLR 2.0.50727) Sleipnir/2.8.4\n\
webkit	525.27.1	Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_5; en-us) AppleWebKit/525.27.1 (KHTML, like Gecko) Stainless/0.4 Safari/525.20.1\n\
webkit	528.16	Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_6; en-us) AppleWebKit/528.16 (KHTML, like Gecko) Stainless/0.5.3 Safari/525.20.1\n\
webkit	525.18	Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_4_11; en) AppleWebKit/525.18 (KHTML, like Gecko) Sunrise/1.7.4 like Safari/4525.22\n\
webkit	125.5.7	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en-us) AppleWebKit/125.5.7 (KHTML, like Gecko) SunriseBrowser/0.853\n\
mozilla	1.9.0.10pre	Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.10pre) Gecko/2009041814 Firefox/3.0.10pre (Swiftfox)\n\
msie	6.0	Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; .NET CLR 1.1.4322; TheWorld)\n\
webkit	1.1.8	Webkit/1.1.8 (Linux; en-us) Uzbl\n\
webkit	1.1.10	Uzbl (X11; U; Linux x86_64; en-GB) AppleWebkit/1.1.10\n\
webkit	1.1.9	Uzbl (Webkit 1.1.9) (Linux)\n\
webkit	1.1.10	Uzbl (U; Linux x86_64; en-GB) Webkit 1.1.10\n\
	0	w3m/0.5.1\n\
	0	w3m/0.5.2\n\
webkit	103u	Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en-us) AppleWebKit/103u (KHTML, like Gecko) wKiosk/100\n\
mozilla	1.9.0.9	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.9) Gecko/2009042410 Firefox/3.0.9 Wyzo/3.0.3\n\
	0	X-Smiles/1.2-20081113\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.0.04506.30; MEGAUPLOAD 2.0)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)\n\
mozilla	1.9.0.4	Mozilla/5.0 (X11; U; Linux i686; en-GB; rv:1.9.0.4) Gecko/2008111217 Fedora/3.0.4-1.fc9 Firefox/3.0.4\n\
mozilla	1.9.0.4	Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.0.4) Gecko/2008102920 Firefox/3.0.4\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506; .NET CLR 1.1.4322; FDM)\n\
msie	6.0	mozilla/4.0 (compatible; msie 6.0; windows nt 5.1; mra 4.6 (build 01425); .net clr 2.0.50727)\n\
msie	7.0	mozilla/4.0 (compatible; msie 7.0; windows nt 5.1; mra 4.9 (build 01863))\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; InfoPath?.2; .NET CLR 3.5.21022; .NET CLR 3.5.30729; .NET CLR 3.0.30618; MS-RTC LM 8; .NET CLR 1.1.4322)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 3.0.04506; InfoPath?.2; .NET CLR 3.5.21022)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Sky Broadband; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 1.1.4322)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; InfoPath.2; .NET CLR 3.5.21022; .NET CLR 3.5.30729; .NET CLR 3.0.30618; MS-RTC LM 8; .NET CLR 1.1.4322)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 3.0.04506; InfoPath.2; .NET CLR 3.5.21022)\n\
msie	7.0	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; GTB6; User-agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; http://bsalsa.com); .NET CLR 1.1.4322; .NET CLR 2.0.50727\n\
opera	10.00	Opera/9.80 (Macintosh; Intel Mac OS X; U; en) Presto/2.2.15 Version/10.00\n\
msie	8.0	Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 1.1.4322; InfoPath?.2; .NET CLR 2.0.50727; CIBA; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)\n\
opera	10.00	Opera/9.80 (X11; Linux x86_64; U; de) Presto/2.2.15 Version/10.00\n\
opera	10.50	Opera/9.80 (Macintosh; Intel Mac OS X; U; en) Presto/2.5.18 Version/10.50';


function uaMatch(ua) {

	// 检查信息
	var match = ua.match(/(IE|Firefox|Chrome|Safari|Opera)[\/\s]([\w\.]*)/i) || ua.match(/(WebKit|Gecko)[\/\s]([\w\.]*)/i) || [0, "", 0],
	
		// 浏览器名字。
		browser = match[1];

	var obj = {};

	obj["is" + browser] = obj["is" + browser + match[3]] = true;

	obj.isQuirks = eval("!-[1,]") && !Object.isObject(document.constructor);

	obj.browser = browser.toLowerCase();

	if (obj.browser === "ie") {
		obj.browser = "msie";
	} else if (obj.browser === "chrome" || obj.browser === "safari" || obj.browser === "webkit") {
		obj.browser = "webkit";
	} else if (obj.browser === "firefox" || obj.browser === "gecko") {
		obj.browser = "mozilla";
	} else if (obj.browser === "Other") {
		obj.browser = "";
	}

	obj.version = match[2];


	return obj;

}

test("navigator", function () {
	var uas = userAgents.split("\n");
	expect(uas.length);

	Object.each(uas, function (value) {
		var parts = value.split("\t");
		var ua = uaMatch(parts[2]);
		equal(ua.browser, parts[0], "Checking browser for " + parts[2]);
	//	equal(ua.version, parts[1], "Checking version string for " + parts[2]);
	});

});