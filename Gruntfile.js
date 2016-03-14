module.exports = function(grunt) {
 
  // Add the grunt-mocha-test tasks. 
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-browserify');
    
  grunt.initConfig({
    
    // organize React .jsx files
    react: {
      // dynamic_mappings: {
      //   files: [
      //     {
      //       expand: true,
      //       cwd: 'public/js/react_components',
      //       src: ['**/*.jsx'],
      //       dest: 'public/js/react_js',
      //       ext: '.js'
      //     }
      //   ]
      // }, 
      build_feed: {
        files: {
          'public/js/react_build/feed.build.js': [
			'public/js/react_components/Friends.jsx',		  
            'public/js/react_components/Comments.jsx',
            'public/js/react_components/PostRenderer.jsx' ,
            'public/js/react_components/Feed.jsx'
          ]
        }
      },
      build_profile: {
        files: {
          'public/js/react_build/profile.build.js': [
            'public/js/react_components/Comments.jsx',
            'public/js/react_components/PostRenderer.jsx' ,
            'public/js/react_components/Profile.jsx',
			'public/js/react_components/Friends.jsx'
          ]
        }
      },
      build_favorites: {
        files: {
          'public/js/react_build/favorites.build.js': [
            'public/js/react_components/Comments.jsx',
            'public/js/react_components/PostRenderer.jsx' ,
            'public/js/react_components/Favorites.jsx'
          ]
        }
      },
      build_postrecipe: {
        files: {
          'public/js/react_build/postrecipe.build.js': [
            'public/js/react_components/PostRecipe.jsx'
          ]
        }
      }
    },

    // Configure a mochaTest task 
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'TestResults.txt', // Optionally capture the reporter output to a file 
          quiet: false, // Optionally suppress output to standard out (defaults to false) 
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
        },
        src: ['test/*.js']
      }
    }
  });
 
  grunt.registerTask('default', ['react']);
};
