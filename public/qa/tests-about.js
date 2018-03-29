suite('Tests About Page', function() {
    test('page should contain link to contact page', function() {
        assert(document.querySelectorAll('a[href="/contact"]').length);
    });
});