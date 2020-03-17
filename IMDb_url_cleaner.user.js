// ==UserScript==
// @name         IMDb url cleaner
// @description  Removes crap from IMDb URLs
// @namespace    http://live.aulddays.com/
// @include      http://imdb.com/*
// @include      https://imdb.com/*
// @include      http://www.imdb.com/*
// @include      https://www.imdb.com/*
// @author       Aulddays
// @grant        none
// @version      2.1
// @run-at       document-start
// ==/UserScript==

// Copyright 2013-2019 Aulddays
// Based on the script by Rennex
/*
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// Based on the script by Rennex

document.addEventListener ("DOMContentLoaded", fix_content);
window.addEventListener ("pageFullyLoaded", fix_content);
fix_locationbar();

function imdburl_fix_single(url)
{
	//console.log("Before:", url);
	while(true)
	{
		var newurl = url.replace(/\?ref_?=[^#&]+$/, "").
		             replace(/\?ref_?=[^#&]+#/, "#").
		             replace(/\?ref_?=[^#&]+&/, "?").
		             replace(/&ref_?=[^#&]+/, "").
		             replace(/\?pf_rd_[a-zA-Z0-9_]*=[^#&]*$/, "").
		             replace(/\?pf_rd_[a-zA-Z0-9_]*=[^#&]*#/, "#").
		             replace(/\?pf_rd_[a-zA-Z0-9_]*=[^#&]*&/, "?").
		             replace(/&pf_rd_[a-zA-Z0-9_]*=[^#&]*/g, "");
		if(newurl == url)
			break;
		url = newurl;
	}
	//console.log("After:", url);
	return url;
}

function fix_locationbar()
{
	//console.log("fix_locationbar");
	var origloc = location.href;
	
	// clean up the hostname
	var newloc = origloc.replace(/(akas|former)\.imdb\.(com|de|it|fr)/, "www.imdb.com");
	// we need to redirect if the hostname changed
	var redirect = (newloc != origloc);
	
	// clean up query string crap
	var newloc = imdburl_fix_single(newloc);
	
	if (redirect)
		location.href = newloc;
	else if (newloc != origloc)
		history.replaceState(null, "", newloc.replace(/^https?:\/\/[^\/]+/, ""));
}

function fix_content()
{
	//console.log("fix_content");
	var links = document.evaluate('//a[@href]', document, null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < links.snapshotLength; i++)
	{
		var a = links.snapshotItem(i);
		if(a.href.match(/imdb\.com\/.*ref_?=/) || a.href.match(/imdb\.com\/.*pf_rd_[a-zA-Z0-9_]*=/))
			a.href = imdburl_fix_single(a.href);
	}
}
