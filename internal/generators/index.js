var buildGenerator = {
    description: "build scripts for program",
    prompts: [
        {
            type:               "input",
            name:               "location",
            message:            "path",
        },
        {
            type:               "input",
            name:               "name",
            message:            "project name",
        },
        {
            type:               "input",
            name:               "width",
            message:            "window width",
        },
        {
            type:               "input",
            name:               "height",
            message:            "window height",
        },
        {
            type:               "input",
            name:               "framerate",
            message:            "framerate",
        },
        {
            type:               "list",
            name:               "world",
            default:            'none',
            choices:            [
                { name: 'none',    value: 'none' },
                { name: 'ecs',     value: 'ecs' },
                { name: 'classic', value: 'classic' },
            ],
            message:            "game world component paradigm",
        },
        {
            type:               "confirm",
            name:               "imgui",
            default:            false,
            message:            "dear imgui debug ui",
        },
        {
            type:               "confirm",
            name:               "tracy",
            default:            false,
            message:            "tracy profiler",
        },
    ],
    actions: function (data) {
        var actions = !data ? [] : [
            {
                type:           'add',
                path:           `${data.location}/src/main.cpp`,
                templateFile:   'generators/main.cpp.hbs'
            },
            {
                type:           'add',
                path:           `${data.location}/CMakeLists.txt`,
                templateFile:   'generators/CMakeLists.txt.hbs'
            },
            {
                type:           'add',
                path:           `${data.location}/.gitignore`,
                templateFile:   'generators/gitignore.hbs'
            },
            {
                type:           'add',
                path:           `${data.location}/Makefile`,
                templateFile:   'generators/Makefile.hbs'
            },
            {
                type:           'add',
                path:           `${data.location}/index.html`,
                templateFile:   'generators/index.html.hbs'
            },
        ]
        return actions
    }
}

module.exports = { buildGenerator }
