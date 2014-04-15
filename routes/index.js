/* jslint node: true */
/*
 * GET home page.
 */
var forRender = {
  title: 'ssrs2insights',
  active: '/',
};

exports.index = function(req, res){
  res.render('index', forRender);
};
