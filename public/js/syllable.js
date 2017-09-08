$(document).ready(function() {
  const line3 = $("#line3").val();

  $("#line1").change(function() {
    const line1 = $("#line1").val();
    const syllable = new_count(line1);
    $("#line1Syl").text("syllables: " + syllable);
  });

  $("#line2").change(function() {
    const line2 = $("#line2").val();
    const syllable = new_count(line2);
    $("#line2Syl").text("syllables: " + syllable);
  });

  $("#line3").change(function() {
    const line3 = $("#line3").val();
    const syllable = new_count(line3);
    $("#line3Syl").text("syllables: " + syllable);
  });
});



function new_count(word) {
  word = word.toLowerCase();                                     //word.downcase!
  if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
  return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
}
