<?php

/* Create Super Editor User Role */
function bubs_role_super_editor() {
    // Sometimes caching causes havoc, so we remove then re-add
    remove_role('super_editor');

    // We want to start with administrator as a base
    $administrator = get_role('administrator');
    $super_editor = clone $administrator;
    $super_editor->name = 'Super Editor';

    // And then remove the capabilities that we don't want (like edit_themes, plugins, etc.)
    $super_editor->capabilities['switch_themes'] = 0;
    $super_editor->capabilities['update_themes'] = 0;
    $super_editor->capabilities['edit_themes'] = 0;
    $super_editor->capabilities['delete_themes'] = 0;
    $super_editor->capabilities['install_themes'] = 0;

    // $super_editor->capabilities['manage_options'] = 0;
    $super_editor->capabilities['export'] = 0;
    $super_editor->capabilities['import'] = 0;

    $super_editor->capabilities['update_core'] = 0;
    $super_editor->capabilities['activate_plugins'] = 0;
    $super_editor->capabilities['edit_plugins'] = 0;
    $super_editor->capabilities['update_plugins'] = 0;
    $super_editor->capabilities['delete_plugins'] = 0;
    $super_editor->capabilities['install_plugins'] = 0;

    add_role(
        'super_editor', //  System name of the role.
        __('Super Editor'), // Display name of the role.
        $super_editor->capabilities, // Array of capabilities.
    );
}

add_action('admin_init', 'bubs_role_super_editor');
