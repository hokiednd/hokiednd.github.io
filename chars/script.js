/*! PDFix license http://pdfix.net/terms. Copyright (c) 2016 Pdfix. All Rights Reserved. */
;function pdfixUpdateLayout() {
    pdfixUpdatePages()
}
window.addEventListener("resize", pdfixUpdateLayout);
function getFirstChild(c, b, d) {
    var a = c.firstChild;
    while (a !== null) {
        if (a.nodeType == 1 && (b == "" || a.nodeName.toLowerCase() == b) && (d == "" || a.getAttribute("data-type") == d)) {
            break
        }
        a = a.nextSibling
    }
    return a
}
function getNextSibling(c, b, d) {
    var a = c.nextSibling;
    while (a !== null) {
        if (a.nodeType == 1 && (b == "" || a.nodeName.toLowerCase() == b) && (d == "" || a.getAttribute("data-type") == d)) {
            break
        }
        a = a.nextSibling
    }
    return a
}
function pdfixUpdatePages() {
    var a = document.getElementById("pdf-document");
    if (a === "undefined" || a.getAttribute("data-type") != "pdf-document") {
        return
    }
    var b = getNextSibling(a, "div", "pdf-page");
    while (b !== null) {
        if (b.style.display != "none") {
            pdfixUpdatePage(b)
        }
        b = getNextSibling(b, "div", "pdf-page")
    }
}
function pdfixUpdatePage(b) {
    var a = b.getAttribute("data-layout");
    if (a == "responsive") {
        pdfixUpdatePageResponsive(b)
    } else {
        pdfixUpdatePageFixed(b)
    }
}
function pdfixUpdatePageFixed(g) {
    var e = g.getAttribute("data-ratio");
    var d = parseFloat(g.offsetWidth);
    g.style.height = d * e + "px";
    var c = getFirstChild(g, "div", "pdf-page-inner");
    if (c !== null) {
        var a = parseFloat(c.getAttribute("data-page-width"));
        var b = d / a;
        var f = getFirstChild(c, "div", "pdf-page-text");
        if (f !== null) {
            updatePageTextsOnce(f)
        }
        c.style.transform = "scale(" + b + ")";
        c.style.transformOrigin = "0px 0px 0px"
    }
}
function pdfixUpdatePageResponsive(e) {
    var g = e.getElementsByTagName("div");
    for (var c = 0, b = g.length; c < b; c++) {
        if (g[c].getAttribute("data-type") == "pdf-image") {
            var d = g[c];
            var j = d.parentElement;
            var a = parseFloat(d.getAttribute("data-image-width"));
            var k = parseFloat(d.getAttribute("data-ratio"));
            var m = parseFloat(j.offsetWidth);
            var f = m / a;
            if (f > 1) {
                f = 1
            }
            d.style.height = a * f / k + "px";
            var h = getFirstChild(d, "div", "pdf-image-inner");
            var l = getFirstChild(h, "div", "pdf-image-childs");
            if (l != null) {
                updatePageTextsOnce(l)
            }
            h.style.transform = "scale(" + f + ")";
            h.style.transformOrigin = "0px 0px 0px"
        }
    }
}
function updatePageTextsOnce(d) {
    if (d.getAttribute("data-text-scaled") != "1") {
        var a = d.firstChild;
        while (a != null) {
            if (a.nodeType == 1) {
                var i = getFirstChild(a, "span", "");
                if (i != null) {
                    var b = parseFloat(i.offsetWidth);
                    var h = parseFloat(a.offsetWidth);
                    var c = parseFloat(i.offsetHeight);
                    var f = parseFloat(a.offsetHeight) - 1;
                    var g = h / b;
                    var e = f / c;
                    a.style.transform = "scaleX(" + g + ") scaleY(" + e + ")";
                    a.style.transformOrigin = "0px 0px 0px"
                }
            }
            a = a.nextSibling
        }
        d.setAttribute("data-text-scaled", "1")
    }
}
;

function showplus(value) {
  var addplus = "";
  if (value > 0) addplus = "+";
  return addplus + value;
}

function calc_mod(field) {
  return showplus(Math.floor((document.getElementsByName(field)[0].value - 10) / 2 ));
}

$(document).keyup(function(){
  document.getElementsByName("details_str_score")[0].value = calc_mod("details_str_modifier");
  document.getElementsByName("details_dex_score")[0].value = calc_mod("details_dex_modifier");
  document.getElementsByName("details_con_score")[0].value = calc_mod("details_con_modifier");
  document.getElementsByName("details_int_score")[0].value = calc_mod("details_int_modifier");
  document.getElementsByName("details_wis_score")[0].value = calc_mod("details_wis_modifier");
  document.getElementsByName("details_cha_score")[0].value = calc_mod("details_cha_modifier");
});

function save_character()
{
  console.log("Saving character...")

  var filename = ".dnd";
  if (document.getElementById('charname').value == "") {
    filename = "CharacterSheet" + filename;
  } else {
    filename = document.getElementById('charname').value + filename;
  }

  // Prepare form data for JSON format
  const formId = "charsheet";
  var url = location.href;
  const formIdentifier = `${url} ${formId}`;
  let form = document.querySelector(`#${formId}`);
  let formElements = form.elements;

  let data = { [formIdentifier]: {} };
  for (const element of formElements) {
    if (element.name.length > 0) {
      if (element.type == 'checkbox') {
        var checked = ($("[name='" + element.name + "']").prop("checked") ? 'checked' : 'unchecked');
        data[formIdentifier][element.name] = checked;
      } else {
        data[formIdentifier][element.name] = element.value;
      }
    }
  }
  data = JSON.stringify(data[formIdentifier], null, 2)
  type = 'application/json'

  // Save JSON to file
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 0);
  }
}
