# Contribution Guide

## What to contribute

### Documentation

Actually, this repo has no good documents.

### Test

This repo has no unit/e2e test at all.  
Despite this repo has simple functionality, tests are always helping.

### Report issue

If you experienced any inconvenience, you can report issue.  
Please visit our [repo](https://github.com/planetarium/9c-table-patcher/issues) and write down what's going on.

### Suggest any good idea

If some good idea comes from your mind, please let us know.  
You can open issue to make new feature and/or discussion to develop your idea.

### Resolve issue with your hand

In the [github issues page](https://github.com/planetarium/9c-table-patcher/issues), you can find plenty of issues to
resolve.  
The `good first issue` label is best issues to start or any issue you can solve is welcome.

## How to contribute

### Fork and clone repository

In main page of repo, you can see the `fork` button to make fork of this repo into your account.  
And then clone your forked repo to your local machine to make something.

```shell
$ git clone https://github.com/{user-name}/9c-table-patcher.git
# or using github cli
$ gh repo clone {your-name}/9c-table-patcher
```

### Create own work branch

The maintaining branch of this repo is just `main`.  
Create new working branch based on `main` just like this:

```shell
$ cd 9c-table-patcher
$ git pull origin main
$ git checkout -b {your-branch-name}
```

Now, ready to make your own contribution.

### Make your contribution

Make your code and commit.  
You have to push your commits to remote(github) repo to make pull request.
```shell
# create new file, edit contents...
$ git add {files to commit}
$ git commit -m "{commit message: brief your work}"
$ git push origin {your-branch-name}
```

### Create pull request

Goto your own github repo and make new pull request.  
Carefully select base repo and branch also with your own working branch.  
And... that's it. Many thanks for your all efforts. Please wait our review :pray:

## Contribution process

1. PR comes in (Thanks for your contribution)
2. Assigning main reviewer
3. Review and feedback between reviewer and contributor
4. Merge PR when everything is good to go
