var request = require('request')
    assert = require('assert')

describe( 'Example Top level suite', function() {
 
    describe( 'Example Second level test suite', function() {
 
        before( function() {
            // executes once, before all tests 
        } );
 
        beforeEach( function() {
            // executes before each test of the suite
        } );
 
        after( function() {
            // executes once, after all tests
        } );
 
        afterEach( function() {
            // executes after each test of the suite
        } );
 
        it( 'should verify a behavior', function() {
            // a test containing assertions
        } );
 
        xit( 'should be a pending test', function() {
            // this test is pending. All assertions inside are ignored.
        } );    
 
        it.skip( 'should also be a pending test', function() {
            // it.skip is a longer, more semantic form of xit
        } );        
 
        it( 'should also be a pending test' );
    } );
 
    describe( 'Another second level test suite', function() {
 
    } );
} );
