import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Input, List, Button } from 'semantic-ui-react'
import postApi from '../api/postApi'
import { selectors } from '../ducks/auth'

class SeriesSelect extends Component {
  state = {
    keyword: '',
    matchedPosts: [],
    seriesPosts: [],
  }

  componentDidUpdate(prevProps) {
    let { input } = this.props
    let prevInput = prevProps.input

    if (input.value !== prevInput.value) {
      this.setState({
        seriesPosts: input.value || [],
      })
    }
  }

  fetchMatchedPosts = async () => {
    let { username } = this.props
    let { keyword } = this.state
    let response = await postApi.listByUsername(username, {
      params: {
        filter: {
          fields: {
            id: true,
            title: true,
          },
          order: 'updatedAt DESC',
        },
        keyword,
      },
    })

    this.setState({ matchedPosts: response.body.posts })
  }

  handleKeywordChange = async (e) => {
    await this.setState({ keyword: e.target.value })
    if (!this.state.keyword) {
      this.setState({ matchedPosts: [] })
    } else {
      this.fetchMatchedPosts()
    }
  }

  handleAddClick = async (idx) => {
    let { input: { onChange } } = this.props
    let { matchedPosts, seriesPosts } = this.state
    let newSeriesPosts = [
      ...seriesPosts,
      matchedPosts[idx],
    ]

    await this.setState({
      seriesPosts: newSeriesPosts,
    })
    onChange(newSeriesPosts)
  }

  handleRemoveClick = async (idx) => {
    let { input: { onChange } } = this.props
    let { seriesPosts } = this.state
    let newSeriesPosts = [
      ...seriesPosts.slice(0, idx),
      ...seriesPosts.slice(idx + 1),
    ]

    await this.setState({
      seriesPosts: newSeriesPosts,
    })
    onChange(newSeriesPosts)
  }

  handleUpClick = async (idx) => {
    if (idx === 0) {
      return
    }

    let { input: { onChange } } = this.props
    let { seriesPosts } = this.state
    let newSeriesPosts = [
      ...seriesPosts.slice(0, idx - 1),
      seriesPosts[idx],
      seriesPosts[idx - 1],
      ...seriesPosts.slice(idx + 1),
    ]

    await this.setState({
      seriesPosts: newSeriesPosts,
    })
    onChange(newSeriesPosts)
  }

  handleDownClick = async (idx) => {
    let { input: { onChange } } = this.props
    let { seriesPosts } = this.state

    if (idx === seriesPosts.length - 1) {
      return
    }

    let newSeriesPosts = [
      ...seriesPosts.slice(0, idx),
      seriesPosts[idx + 1],
      seriesPosts[idx],
      ...seriesPosts.slice(idx + 2),
    ]

    await this.setState({
      seriesPosts: newSeriesPosts,
    })
    onChange(newSeriesPosts)
  }

  isPostInSeries = (postId) => {
    let { seriesPosts } = this.state

    return seriesPosts
      .filter(post => post.id === postId)
      .length > 0
  }

  render() {
    let { keyword, matchedPosts, seriesPosts } = this.state

    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Input
                placeholder="搜尋我的所有文章"
                value={keyword}
                onChange={this.handleKeywordChange}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>系列裡的文章</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <List divided>
                {matchedPosts.map((post, idx) => (
                  <List.Item key={post.id}>
                    <List.Content floated="right">
                      <Button
                        onClick={this.handleAddClick.bind(this, idx)}
                        disabled={this.isPostInSeries(post.id)}
                      >
                        加入本系列
                      </Button>
                    </List.Content>
                    <List.Content>{post.title}</List.Content>
                  </List.Item>
                ))}
              </List>
            </Table.Cell>
            <Table.Cell>
              <List divided>
                {seriesPosts.map((post, idx) => (
                  <List.Item key={post.id}>
                    <List.Content floated="right">
                      <Button onClick={this.handleUpClick.bind(this, idx)}>
                        ↑
                      </Button>
                      <Button onClick={this.handleDownClick.bind(this, idx)}>
                        ↓
                      </Button>
                      <Button
                        onClick={this.handleRemoveClick.bind(this, idx)}
                      >
                        從系列中移除
                      </Button>
                    </List.Content>
                    <List.Content>{post.title}</List.Content>
                  </List.Item>
                ))}
              </List>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}

export default connect(state => ({
  username: selectors.getLoggedUser(state.auth).username,
}))(SeriesSelect)
