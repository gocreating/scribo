import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Input, List, Button } from 'semantic-ui-react'
import postApi from '../api/postApi'
import { selectors } from '../ducks/auth'

class SeriesSelect extends Component {
  state = {
    keyword: '',
    isMatching: false,
    matchedPosts: [],
    seriesPosts: [],
  }

  componentDidUpdate(prevProps) {
    let { input } = this.props
    let prevInput = prevProps.input
    let seriesPosts = input.value || []

    seriesPosts.sort((a, b) => a.order - b.order)
    if (input.value !== prevInput.value) {
      this.setState({ seriesPosts })
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
      await this.setState({ isMatching: true })
      await this.fetchMatchedPosts()
      await this.setState({ isMatching: false })
    }
  }

  applyChange = async (newSeriesPosts) => {
    let { input } = this.props
    let orderedSeriesPosts = newSeriesPosts.map((post, idx) => ({
      ...post,
      order: idx,
    }))

    await this.setState({
      seriesPosts: orderedSeriesPosts,
    })
    input.onChange(orderedSeriesPosts)
  }

  handleAddClick = (idx) => {
    let { matchedPosts, seriesPosts } = this.state
    let newSeriesPosts = [
      ...seriesPosts,
      matchedPosts[idx],
    ]

    this.applyChange(newSeriesPosts)
  }

  handleRemoveClick = (idx) => {
    let { seriesPosts } = this.state
    let newSeriesPosts = [
      ...seriesPosts.slice(0, idx),
      ...seriesPosts.slice(idx + 1),
    ]

    this.applyChange(newSeriesPosts)
  }

  handleUpClick = (idx) => {
    if (idx === 0) {
      return
    }

    let { seriesPosts } = this.state
    let newSeriesPosts = [
      ...seriesPosts.slice(0, idx - 1),
      seriesPosts[idx],
      seriesPosts[idx - 1],
      ...seriesPosts.slice(idx + 1),
    ]

    this.applyChange(newSeriesPosts)
  }

  handleDownClick = (idx) => {
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

    this.applyChange(newSeriesPosts)
  }

  isPostInSeries = (postId) => {
    let { seriesPosts } = this.state

    return seriesPosts
      .filter(post => post.id === postId)
      .length > 0
  }

  render() {
    let { keyword, isMatching, matchedPosts, seriesPosts } = this.state

    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>系列裡的文章</Table.HeaderCell>
            <Table.HeaderCell>
              <Input
                placeholder="搜尋想加入的文章"
                value={keyword}
                onChange={this.handleKeywordChange}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>
              {seriesPosts.length === 0 && '尚無系列文章'}
              {seriesPosts.length > 0 && (
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
              )}
            </Table.Cell>
            <Table.Cell>
              {isMatching && '查詢中...'}
              {!isMatching && matchedPosts.length === 0 && '查無相關文章'}
              {!isMatching && matchedPosts.length > 0 && (
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
              )}
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
