$(window).on("load", function () {
  const replaceString = "A partir de";
  setInterval(() => {
    const replaceString = "A partir de";
    $.each($("td.monetary"), (i, el) => {
      const text = $(el).text();
      if (text.includes(replaceString)) {
        $(el).text(text.replace(replaceString, "").trim());
      }
    });
  }, 300);
});
