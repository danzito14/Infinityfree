<?php

class SiteInfo {
	/** @var string */
	public $siteId;
	/** @var string */
	public $websiteUID;
	/** @var string */
	public $domain;
	/** @var string */
	public $prettyDomain;
	/** @var string */
	public $homePageId;
	/** @var string */
	public $baseDir;
	/** @var string */
	public $baseUrl;
	/** @var string|null */
	public $defLang;
	/** @var string|null */
	public $baseLang;
	/** @var array */
	public $langs;
	/** @var array */
	public $pages;
	/** @var array */
	public $forms;
	/** @var bool */
	public $modRewrite;
	/** @var string */
	public $gaCode;
	/** @var bool */
	public $gaAnonymizeIp;
	/** @var int */
	public $port;
	/** @var string */
	public $pathPrefix;
	/** @var bool */
	public $useTrailingSlashes;
	/** @var bool */
	public $disableFormSending = false;
	
	/** @return SiteInfo */
	public static function build(array $data) {
		$res = new self();
		foreach ($data as $k => $v) {
			if (property_exists($res, $k)) $res->{$k} = $v;
		}
		return $res;
	}
}

class SiteRequestInfo {
	/** @var array|null */
	public $page;
	/** @var string */
	public $lang;
	/** @var string[] */
	public $urlArgs;
	/** @var string */
	public $route;
	/** @var string */
	public $requestUri;
	/** @var string Used to override statically built SEO */
	public $title = '';
	/** @var string Used to override statically built SEO */
	public $description = '';
	/** @var string Used to override statically built SEO */
	public $keywords = '';
	/** @var string Used to override statically built SEO */
	public $image = '';

	/** @return SiteRequestInfo */
	public static function build(array $data) {
		$res = new self();
		foreach ($data as $k => $v) {
			if (property_exists($res, $k)) $res->{$k} = $v;
		}
		return $res;
	}
}
